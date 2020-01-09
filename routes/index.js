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
  
  // if (user.modifPwd===true) {
  //   res.redirect('authentication/mofifPwd'); // not logged-in
  //   return;
  // }

  // ok, req.user is defined
  res.render("espacePerso/mon-accueil", { user: req.user });
});

//Profil (private page)
router.get("/profil", (req, res) => {
  if (!req.user) {
    res.redirect('authentication/login'); // not logged-in
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

// router.post('/profil-edit', (req, res, next) => {
//   const userId = user._id;
//   const userInfo = {
//   nom: req.body.nom,
//   email:req.body.email,
//   // telephone1: req.body.telephone1,
//   // telephone2: req.body.telephone2,
//   // telephone3: req.body.telephone3
//   };

//   User.findByIdAndUpdate({userId}, {userInfo})
//   .then(user => res.redirect('espacePerso/profil')) 
//   .catch(err => next(err))
//      ;

// });
    // req.session.currentUser = theUser;

    
    router.post("/edit-profil", (req, res, next) => {
          if (req.user) {
      User.updateOne({ _id: req.user._id  }, { $set : {
         name: req.body.name,
         nom: req.body.nom,
        email: req.body.email,
      }})
        .then(user => res.redirect("/mon-accueil"))
        .catch(err => next(err))
      ;
      }
    });




module.exports = router;
