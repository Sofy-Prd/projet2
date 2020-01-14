mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilleSchema = new Schema({
  username: String,
  password: String,
  modifPwd: Boolean,
  nom: String,
  rue: String,
  codePostal: String,
  ville: String,
  telephone1:String,
  telephone2: String,
  telephone3:String,
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
  ],
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

const User = mongoose.model('User', FamilleSchema); //User à la place de Famille

module.exports = User;


