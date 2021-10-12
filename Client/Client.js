const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  cpf: String,
  consultations: { type: Schema.Types.ObjectId, ref: 'Consultation' },
},  {collection: 'clients'})


var Client = mongoose.model('Client', clientSchema);

module.exports = Client;