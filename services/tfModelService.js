const path = require("path");
const { pathToFileURL } = require("url");
const tf = require("@tensorflow/tfjs");
const wasmBackend = require("@tensorflow/tfjs-backend-wasm");

const MODEL_VERSION = "v1.0";

let model = null;
let ready = false;
let inputName = null;
let outputName = null;
let inputDim = null;

function getModelInfo() {
  return {
    ready,
    modelVersion: MODEL_VERSION,
    inputName,
    outputName,
    inputDim
  };
}

function wasmFileDirUrl() {
  const distFsPath = path.join(
    __dirname,
    "..",
    "node_modules",
    "@tensorflow",
    "tfjs-backend-wasm",
    "dist"
  );
  return pathToFileURL(distFsPath + path.sep).href;
}

async function initModel(serverUrl) {
  wasmBackend.setWasmPaths(wasmFileDirUrl());

  await tf.setBackend("wasm");
  await tf.ready();

  const modelUrl = `${serverUrl}/model/model.json`;
  model = await tf.loadGraphModel(modelUrl);

  inputName = model.inputs?.[0]?.name || null;
  inputDim = model.inputs?.[0]?.shape?.[1] ?? null;
  outputName = model.outputs?.[0]?.name || null;

  if (!inputName || !outputName || !inputDim) {
    throw new Error("No se pudo detectar inputName/outputName/inputDim");
  }

  const Xwarm = tf.zeros([1, inputDim], "float32");
  let out;
  if (typeof model.executeAsync === "function") {
    out = await model.executeAsync({ [inputName]: Xwarm });
  } else {
    out = model.execute({ [inputName]: Xwarm });
  }

  if (Array.isArray(out)) out.forEach(t => t?.dispose?.());
  else out?.dispose?.();
  Xwarm.dispose();

  ready = true;
}

async function predict(features) {
  if (!ready || !model) throw new Error("Model not ready");
  if (!Array.isArray(features) || features.length !== inputDim) {
    throw new Error(`features must be an array of ${inputDim} numbers`);
  }

  const X = tf.tensor2d([features], [1, inputDim], "float32");
  let out;
  if (typeof model.executeAsync === "function") {
    out = await model.executeAsync({ [inputName]: X });
  } else {
    out = model.execute({ [inputName]: X });
  }

  const preds2d = Array.isArray(out) ? await out[0].array() : await out.array();
  const prediction = Math.max(preds2d?.[0]?.[0] ?? 0, 0);

  if (Array.isArray(out)) out.forEach(t => t?.dispose?.());
  else out?.dispose?.();
  X.dispose();

  return prediction;
}

module.exports = {
  initModel,
  getModelInfo,
  predict
};
