mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoursSchema = new Schema({
  nom: String,
  prof: {type: Schema.Types.ObjectId, ref: 'Prof'},
  lieu: {type: Schema.Types.ObjectId, ref: 'Lieu'},
  jour: String,
  horaire: String,
  duree: {type: Schema.Types.ObjectId, ref: 'Tarif'}
});

const Cours = mongoose.model('Cours', CoursSchema);

module.exports = Cours;