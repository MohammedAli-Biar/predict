require("dotenv").config();
const mongoose = require("mongoose");

const MONGOPATH = process.env.MONGO_URI;

mongoose.connect(MONGOPATH)
  .then(() => console.log('Conectado a la base de datos.'))
  .catch(err => console.error('Error conectando a la base de datos:', err));

const esquema = mongoose.Schema;

const PredictEsquema = new esquema({
  resultado: { type: Number, required: true },
  timestamp: { type: Date, required: true }
});

module.exports = mongoose.model('Predict', PredictEsquema);
