mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilleSchema = new Schema({
  username: String,
  password: String,
  modifPwd: Boolean,
  nom: String,
  adresse: { rue: String, codePostal: Number, ville: String },
  telephone1: { numero: String, envoiSMS: Boolean },
  telephone2: { numero: String, envoiSMS: Boolean },
  telephone3: { numero: String, envoiSMS: Boolean },
  email: String,
  adherent: [ 
    {
      prenom: String,
      nom: String,
      dateNaissance: Date,
      photoAdherent: String,
      cours1: {type: Schema.Types.ObjectId, ref: 'Cours'}, //modif pour ajouter des fields par cours
      cours2: {type: Schema.Types.ObjectId, ref: 'Cours'},
      cours3: {type: Schema.Types.ObjectId, ref: 'Cours'}
    }
  ]
}, {
  timestamps: true
});

const User = mongoose.model('User', FamilleSchema); //User à la place de Famille

module.exports = User;


