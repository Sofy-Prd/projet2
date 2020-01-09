const express = require('express');
const router  = express.Router();

const User = require('../models/famille');



/* GET home page */
router.get('/', function (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }

  res.render("espacePerso/mon-accueil", { user: req.user });
});

//Routes pour mon-accueil (private page)
router.get("/mon-accueil", (req, res) => {
  if (!req.user) {
    res.redirect('/login'); // not logged-in
    return;
  }
  
  if (req.user.modifPwd===true) {
    res.redirect('/modifPwd'); 
    return;
  }

  // ok, req.user is defined
  res.render("espacePerso/mon-accueil", { user: req.user });
});

//Profil (private page)
router.get("/profil", (req, res) => {
  if (!req.user) {
    res.redirect('/login'); // not logged-in
    return;
  }

  // ok, req.user is defined
  res.render("espacePerso/profil", { user: req.user });
});


router.get("/edit-profil", (req, res) => {
  if (!req.user) {
    res.redirect('/login'); // not logged-in
    return;
  }
  // ok, req.user is defined
  res.render("espacePerso/edit-profil", { user: req.user });

});

   
    router.post("/edit-profil", (req, res, next) => {
    if (req.user) {
      User.updateOne({ _id: req.user._id  }, { $set : {
        email: req.body.email,
        rue: req.body.rue,
        codePostal: req.body.codePostal,
        ville: req.body.ville,
        telephone1:req.body.telephone1,
        telephone2:req.body.telephone2,
        telephone3:req.body.telephone3,
      }})
        .then(user => res.redirect("/profil"))
        .catch(err => next(err))
      ;
      }
    });




module.exports = router;
