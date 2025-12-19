const express = require("express");
const router = express.Router();
const predictController = require("../controllers/predictController");

router.get("/health", predictController.health);
router.get("/ready", predictController.ready);
router.post("/predict", predictController.doPredict);

module.exports = router;
