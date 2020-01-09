const mongoose = require('mongoose');
const Prof = require('../models/prof.js');

mongoose.connect('mongodb://localhost/espaceFamille', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
  .then(() => {
    console.log('🔌 Connected to Mongo!');
  })
  .catch(err => console.error('Error connecting to mongo', err))
;

var profsDatas = [
  {
    prenom: 'Lucile',
    email: 'sandrine.auberval@gmail.com',
    photo: 'https://res.cloudinary.com/dkwcrwudm/image/upload/v1577801087/Projet2%20-%20Les%20Trembles/lucile_gp5qik.jpg'
      
  },
   {
    prenom: 'Claudia',
    email: 'sandrine.auberval@gmail.com',
    photo: 'https://res.cloudinary.com/dkwcrwudm/image/upload/v1577801087/Projet2%20-%20Les%20Trembles/claudia_luyrvd.jpg'
      
  },
   {
    prenom: 'Angelina',
    email: 'sandrine.auberval@gmail.com',
    photo: 'https://res.cloudinary.com/dkwcrwudm/image/upload/v1577801087/Projet2%20-%20Les%20Trembles/angelina_xpncys.jpg'
      
  },
   {
    prenom: 'Cassandre',
    email: 'sandrine.auberval@gmail.com',
    photo: 'https://res.cloudinary.com/dkwcrwudm/image/upload/v1577801086/Projet2%20-%20Les%20Trembles/cassandre_jqhpd3.jpg'
      
  },
   {
    prenom: 'Marie',
    email: 'sandrine.auberval@gmail.com',
    photo: 'https://res.cloudinary.com/dkwcrwudm/image/upload/v1577801084/Projet2%20-%20Les%20Trembles/marie_cpsbyc.jpg'
      
  }
];

Prof.create(profsDatas)
.then(profs => console.log(`${profs.length} profs créés!`));

