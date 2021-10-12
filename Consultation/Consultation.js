const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const consultationsSchema = new mongoose.Schema({
  client: { type: Schema.Types.ObjectId, ref: 'Client' },
  description: String,
  date: Date,
  timestart: String,
  timeend: String,
  finished: Boolean,
  notified: Boolean,
}, {collection: 'consultations'})


var Consultation = mongoose.model('Consultation', consultationsSchema);

module.exports = Consultation;
