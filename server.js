require("dotenv").config();
const express = require("express");
const path = require("path");
const predictRoutes = require("./routes/predictRoutes");
const { initModel } = require("./services/tfModelService");

const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.json());

// Servir carpeta del modelo TFJS
const modelDir = path.resolve(__dirname, "model");
app.use("/model", express.static(modelDir));

// Rutas del servicio
app.use("/", predictRoutes);

// Arranque del servidor + carga del modelo
app.listen(PORT, async () => {
  const serverUrl = `http://localhost:${PORT}`;
  console.log(`[PREDICT] Servicio escuchando en ${serverUrl}`);

  try {
    await initModel(serverUrl);
    console.log("[PREDICT] Modelo inicializado y listo.");
  } catch (err) {
    console.error("[PREDICT] Error al inicializar modelo:", err);
    process.exit(1);
  }
});
