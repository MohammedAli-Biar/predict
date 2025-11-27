
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/predict')
    .then(() => {
        console.log('Conectado a la base de datos.');
    }).catch(err => {
        console.error('Error conectando a la base de datos:',err);
    });
 
const esquema = mongoose.Schema;
const PredictEsquema = new esquema({
    resultado: { type : Number, required : true},
    marcaT: String,
});
module.exports = mongoose.model('Predict', PredictEsquema)