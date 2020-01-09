const mongoose = require('mongoose');
const Tarif = require('../models/tarif.js');

mongoose.connect('mongodb://localhost/espaceFamille', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
  .then(() => {
    console.log('🔌 Connected to Mongo!');
  })
  .catch(err => console.error('Error connecting to mongo', err))
;

var tarifsDatas = [
  {
    duree: '1H',
    montant: 150  
  },
  {
    duree: '1H30',
    montant: 180  
  },
  {
    duree: '2H',
    montant: 216  
  }
   
];

Tarif.create(tarifsDatas)
.then(tarifs => console.log(`${tarifs.length} tarifs créés!`));

