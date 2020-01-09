const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/famille');


const bcryptSalt = 10;



//Login process
router.get('/login', (req, res) => {
  res.render('authentication/login', { message: req.flash('error')});
});


router.post('/login', passport.authenticate('local', {
  successRedirect : '/mon-accueil',
  failureRedirect : '/login',
  failureFlash : 'Invalid username or password.'
  }
));

//Routes pour reinitialiser le mot de passe
router.get('/modifPwd', (req, res) => {
  res.render('authentication/modifPwd', { user: req.user });
});


router.post("/modifPwd", (req, res, next) => { 
    
  if (!req.user) {
    res.redirect('/login'); // not logged-in
    return;
  }

  if (req.user) {
    const password1 = req.body.password1;
    const password2 = req.body.password2;
    const salt = bcrypt.genSaltSync(bcryptSalt);

    

  //Check password1 and password2 are not empty
  if (password1 === "" || password2 === "" ) {
    console.log ('mdp vide');
    res.render("authentication/modifPwd", { errorMessage: "Le mot de passe ne peut pas être vide" });
    return;
  }

  //on verifie que les deux mdp sont identiques
  if (password1 !== password2) {
    res.render("authentication/modifPwd", { errorMessage: "Les deux mots de passe ne sont pas identiques" });
    return;
  }

  const hashPassNew = bcrypt.hashSync(req.body.password1, salt);
  const user=req.user;
  user.modifPwd=false;
  user.password=hashPassNew;
  user.save()
    .then(user => {
      console.log("mdp modifié");
      res.redirect('/mon-accueil')})
    .catch(err => next(err))
    ;

  }
});



router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;