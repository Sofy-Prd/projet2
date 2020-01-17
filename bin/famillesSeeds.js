const mongoose = require('mongoose');
const Prof = require('../models/prof.js');
const Lieu = require('../models/lieu.js');
const Tarif = require('../models/tarif.js');
const Cours = require('../models/cours.js');
const Famille = require('../models/famille.js');

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);


mongoose.connect("mongodb://localhost/espaceFamille", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
  .then(() => {
    console.log('🔌 Connected to Mongo!');
  })
  .catch(err => console.error('Error connecting to mongo', err))
;

var famillesDatas = [
  { 
    username: 'MARTIN',
    password: bcrypt.hashSync('Password', salt),
    modifPwd: true,
    nom: 'MARTIN',
    rue: '42 av des Pyrenées',
    codePostal: '77270',
    ville: 'Villeparisis',
    telephone1: '0605040302',
    telephone2:'0615243342',     
    email: 'sofy93.prd@gmail.com',
    adherent: [
           {
      prenom: 'LEANNE', 
      nom: 'MARTIN',
      dateNaissance: 2008-09-30, 
      photoAdherent:'',
      cours1: '3e niveau',
      cours2: '',
      cours3: ''
      }
    ],
    resetPasswordToken: '',
    resetPasswordExpires: ''
  },
      
  { 
    username: 'DUPOND',
    password: bcrypt.hashSync('Password', salt),
    modifPwd: true,
    nom: 'DUPOND',
    rue: '9 Avenue des Lilas',
    codePostal: '93290',
    ville: 'Tremblay en France',
    telephone1: '0605040307',
    telephone2: '0615243347', 
    email: 'sophie.pirodon@gmail.com',
    adherent: [
      {
      prenom: 'Marion',
      nom: 'DUPOND', 
      dateNaissance: 2002-07-19, 
      photoAdherent: '',
      cours1: 'Ados',
      cours2: '',
      cours3: ''
      },
      {
      prenom: 'ROXANE',
      nom: 'DUPOND', 
      dateNaissance: 1999-01-04, 
      photoAdherent:'',
      cours1: 'Afrovibe',
      cours2: '',
      cours3: ''
      }
    ],
    resetPasswordToken: '',
    resetPasswordExpires: ''
  }
];
  
const p5 = famillesDatas.forEach(famille => {
  for (let i=0 ; i<famille.adherent.length ; i++) {
    const cours1Id = Cours.findOne({nom: famille.adherent[i].cours1});
    const cours2Id = Cours.findOne({nom: famille.adherent[i].cours2});
    const cours3Id = Cours.findOne({nom: famille.adherent[i].cours3});
      
    Promise.all([cours1Id, cours2Id, cours3Id]).then(ids => {
      famille.adherent[i].cours1 = ids[0];
      famille.adherent[i].cours2 = ids[1];
      famille.adherent[i].cours3 = ids[2];   
    }).then(function () { 
      Famille.create(famille).then(function (famille) { 
        console.log(`${famille}`);
      }).catch(err => console.error(err));
    }).catch(err => console.error(err));
  } 
});

