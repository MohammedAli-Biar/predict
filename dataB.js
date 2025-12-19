require("dotenv").config();
const mongoose = require('mongoose');

const MONGOPATH = process.env.MONGO_URI || 'mongodb://localhost:27017/predict';

mongoose.connect(MONGOPATH, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conectado a la base de datos.'))
  .catch(err => console.error('Error conectando a la base de datos:', err));

const esquema = mongoose.Schema;

const PredictEsquema = new esquema({
  resultado: { type: Number, required: true },
  timestamp: { type: Date, required: true }
});

module.exports = mongoose.model('Predict', PredictEsquema);
