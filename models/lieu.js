mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LieuSchema = new Schema({
  nom: String,
  adresse: String
});

const Lieu = mongoose.model('Lieu', LieuSchema);

module.exports = Lieu;