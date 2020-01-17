const mongoose = require('mongoose');
const Lieu = require('../models/lieu.js');

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
  .then(() => {
    console.log('🔌 Connected to Mongo!');
  })
  .catch(err => console.error('Error connecting to mongo', err))
;

var sallesDatas = [
  {
    nom: 'Gymnase Guimier',
    adresse: '70, Avenue Gilbert Berger'
      
  },
   {
    nom: 'Salle Dossisard',
    adresse: '48, Avenue Louis Decquet'
  },
   {
    nom: 'Salle des Associations du Centre Ville',
    adresse: '8, Rue Pierre Brossolette'  
  },
  {
    nom: 'Espace 110',
    adresse: 'Avenue du Parc'  
  }
];

Lieu.create(sallesDatas)
.then(lieux => console.log(`${lieux.length} salles créés!`));

