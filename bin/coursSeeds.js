const mongoose = require('mongoose');
const Prof = require('../models/prof.js');
const Lieu = require('../models/lieu.js');
const Tarif = require('../models/tarif.js');
const Cours = require('../models/cours.js');

mongoose.connect('process.env.MONGODB_URI', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
  .then(() => {
    console.log('🔌 Connected to Mongo!');
  })
  .catch(err => console.error('Error connecting to mongo', err))
;

var coursDatas = [
  {
    nom: 'Eveil',
    prof: 'Lucile',
    lieu: 'Salle des Associations du Centre Ville',
    jour: 'Samedi',
    horaire: '10H30-11H30',
    duree: '1H'
  },
  {
    nom: 'Initiation',
    prof: 'Lucile',
    lieu: 'Salle des Associations du Centre Ville',
    jour: 'Samedi',
    horaire: '11H30-12H30',
    duree: '1H'
  },
  {
    nom: '1er niveau',
    prof: 'Lucile',
    lieu: 'Salle des Associations du Centre Ville',
    jour: 'Samedi',
    horaire: '15H-16H',
    duree: '1H'
  },
  {
    nom: '2e niveau A',
    prof: 'Lucile',
    lieu: 'Salle des Associations du Centre Ville',
    jour: 'Samedi',
    horaire: '13H-14H',
    duree: '1H'
  },
  {
    nom: '2e niveau B',
    prof: 'Lucile',
    lieu: 'Salle des Associations du Centre Ville',
    jour: 'Samedi',
    horaire: '14H-15H',
    duree: '1H'
  },
  {
    nom: '3e niveau',
    prof: 'Claudia',
    lieu: 'Gymnase Guimier',
    jour: 'Vendredi',
    horaire: '18H30-20H',
    duree: '1H30'
  },
  {
    nom: '4e niveau',
    prof: 'Claudia',
    lieu: 'Gymnase Guimier',
    jour: 'Vendredi',
    horaire: '20H-22H',
    duree: '2H'
  },
  {
    nom: 'Ados',
    prof: 'Marie',
    lieu: 'Salle Dossisard',
    jour: 'Mardi',
    horaire: '18H30-20H30',
    duree: '2H'
  },
  {
    nom: 'Afrovibe',
    prof: 'Angelina',
    lieu: 'Salle Dossisard',
    jour: 'Mardi',
    horaire: '20H30-21H30',
    duree: '1H'
  },
  {
    nom: 'Jeunes Adultes',
    prof: 'Cassandre',
    lieu: 'Salle Dossisard',
    jour: 'Jeudi',
    horaire: '20H00-22H00',
    duree: '2H'
  },
  {
    nom: 'Adultes',
    prof: 'Claudia',
    lieu: 'Espace 110',
    jour: 'Lundi',
    horaire: '20H00-22H00',
    duree: '2H'
  },
    
];

const p4 = coursDatas.forEach(cour => {
  const idProf = Prof.findOne({prenom: cour.prof});
  const idLieu = Lieu.findOne({nom: cour.lieu});
  const idTarif = Tarif.findOne({duree: cour.duree}); //tarif ou duree à indiquer ; idem dans les datas cours???

  Promise.all([idProf, idLieu, idTarif]).then(ids => {
    cour.prof = ids[0];
    cour.lieu = ids[1];
    cour.duree = ids[2];
  }).then(function () { 
    Cours.create(cour).then(function (cour) { 
      console.log(`${cour}`);
    }).catch(err => console.error(err)); 
  }).catch(err => console.error(err));
}); 
