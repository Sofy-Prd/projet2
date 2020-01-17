const mongoose = require('mongoose');
const Prof = require('../models/prof.js');
const Lieu = require('../models/lieu.js');
const Tarif = require('../models/tarif.js');
const Cours = require('../models/cours.js');
const Famille = require('../models/famille.js');

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);


mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
  .then(() => {
    console.log('🔌 Connected to Mongo!');
  })
  .catch(err => console.error('Error connecting to mongo', err))
;

var famillesDatas = [
  { 
    username: 'FERREIRA',
    password: bcrypt.hashSync('Password', salt),
    modifPwd: true,
    nom: 'FERREIRA',
    rue: '42 av des Pyrenées',
    codePostal: '77270',
    ville: 'Villeparisis',
    telephone1: '0605040302',
    telephone2:'0615243342',     
    email: 'sophie.pirodon@gmail.com',
    adherent: [
      {
      prenom: 'ELINE', 
      nom: 'FERREIRA', 
      dateNaissance: 2011-12-14, 
      photoAdherent: '',
      cours1: '2e niveau A',
      cours2: '',
      cours3: ''
      },
      {
      prenom: 'LEANNE', 
      nom: 'FERREIRA',
      dateNaissance: 2008-09-30, 
      photoAdherent:'',
      cours1: '3e niveau',
      cours2: '',
      cours3: ''
      },
      {
      prenom: 'EMILIE', 
      nom: 'FERREIRA', 
      dateNaissance: 1980-04-15, 
      photoAdherent:'',
      cours1: 'Adultes',
      cours2: 'Afrovibe',
      cours3: '' 
      }
    ],
    resetPasswordToken: '',
    resetPasswordExpires: ''
  },
    
  {
    username: 'MARTIN',
    password: bcrypt.hashSync('Password', salt),
    modifPwd: true,
    nom: 'MARTIN',
    rue: '12 RUE ISAAC NEWTON',
    codePostal: '93290',
    ville: 'Tremblay en France',
    telephone1: '0605040306',
    telephone2:'0615243346',
    email: 'sophie.pirodon@gmail.com',
    adherent: [
      {
      prenom: 'CAMILLE', 
      nom: 'MARTIN', 
      dateNaissance: 2015-03-13,
      photoAdherent:'',
      cours1: 'Eveil',
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
      },
      {
      prenom: 'Celine', 
      nom: 'DUPOND', 
      dateNaissance: 1970-11-20, 
      photoAdherent:'',
      cours1: 'Afrovibe',
      cours2: '',
      cours3: '' 
      }
    ],
    resetPasswordToken: '',
    resetPasswordExpires: ''
  },
    
  {
    username: 'JAOUANI',
    password: bcrypt.hashSync('Password', salt),
    modifPwd: true,
    nom: 'JAOUANI',
    rue: '52 ALLEE JOHANNES KEPLER',
    codePostal: '93290',
    ville: 'Tremblay en France',
    telephone1: '0605040310',
    telephone2: '0615243350',
    email: 'sophie.pirodon@gmail.com',
    adherent: [
      {
      prenom: 'ALEXIA', 
      nom: 'JAOUANI', 
      dateNaissance: 2003-01-22, 
      photoAdherent:'',
      cours1: 'Ados',
      cours2: '',
      cours3: '' 
      }
    ],
    resetPasswordToken: '',
    resetPasswordExpires: ''
  },

  { 
    username: 'SUNDI',
    password: bcrypt.hashSync('Password', salt),
    modifPwd: true,
    nom: 'SUNDI',
    rue: '25 av du Pré Gobelin',
    codePostal: '93290',
    ville: 'Tremblay en France',
    telephone1: '0605040311',
    telephone2: '0615243351',
    email: 'sophie.pirodon@gmail.com',
    adherent: [
      {
      prenom: 'LANA',
      nom: 'SUNDI',
      dateNaissance: 2010-09-28,
      photoAdherent: '',
      cours1: '2e niveau A',
      cours2: '',
      cours3: '' 
      },
      {
      prenom: 'LYA', 
      nom: 'SUNDI', 
      dateNaissance: 2014-01-19,
      photoAdherent: '', 
      cours1: '1er niveau',
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

