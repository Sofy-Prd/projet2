const express = require('express');
const router  = express.Router();
const nodemailer  = require('nodemailer');
const User = require('../models/famille');
const Cours = require('../models/cours');
const Prof = require('../models/prof');
const Lieu = require('../models/lieu');
const Tarif = require('../models/tarif');
const templates = require('../templates/template');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.ClientID,
  process.env.ClientSecret,
  "https://developers.google.com/oauthplayground"
);
const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
       type: "OAuth2",
       user: "associationlestrembles@gmail.com", 
       clientId: process.env.ClientID,
       clientSecret: process.env.ClientSecret,
       refreshToken: process.env.RefreshToken,
       accessToken: process.env.AccessToken
  }
});
oauth2Client.setCredentials({
  refresh_token: "1//04O1JtOIXrEHlCgYIARAAGAQSNwF-L9IrKvETwC2gOcc0fuFbcR2iB1vhIItEJ9g-Oa3Sej-eQKlcrvGp5yFIRiajoS1t8zHKXq8"
});
const accessToken = oauth2Client.getAccessToken()

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
  
  if (req.user.modifPwd === true) {
    res.redirect('/modifPwd'); 
    return;
  }
  // ok, req.user is defined
  res.render("espacePerso/mon-accueil", { user: req.user });
});

//Profil (private page)
router.get("/profil", (req, res, next) => {
  if (!req.user) {
    res.redirect('/login'); // not logged-in
    return;
  }
  // ok, req.user is defined    
  User.findOne({_id : req.user._id})
  .populate({
    path: 'adherent.cours1',
    populate: {
      path: 'prof'
    }
  })
  .populate({
    path: 'adherent.cours2',
    populate: {
      path: 'prof'
    }
  })
  .then(function(user){
    res.render("espacePerso/profil", {user});
  })
  .catch(function (err) { 
    next(err);
  });
});

router.get("/adherents", (req, res, next) => {
  if (!req.user) {
    res.redirect('/login'); // not logged-in
    return;
  }
  // ok, req.user is defined    
  User.findOne({_id : req.user._id})
  .populate({
    path: 'adherent.cours1',
    populate: {
      path: 'prof'
    }
  })
  .populate({
    path: 'adherent.cours1',
    populate: {
      path: 'lieu'
    }
  })
  .populate({
    path: 'adherent.cours2',
    populate: {
      path: 'prof'
    }
  })
  .populate({
    path: 'adherent.cours2',
    populate: {
      path: 'lieu'
    }
  })
  .then(function(user){
    res.render("espacePerso/adherents", {user});
  })
  .catch(function (err) { 
    next(err);
  });
});

//Editer profil famille/adherent (private page)
router.get("/edit-profil", (req, res, next) => {
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

//Absence adherent (private page)
router.get("/absence", (req, res) => {
    if (!req.user) {
      res.redirect('authentication/login'); // not logged-in
      return;
    }
  // ok, req.user is defined    
  User.findOne({_id : req.user._id})
  .populate({
    path: 'adherent.cours1',
    populate: {
      path: 'prof'
    }
  })
  .populate({
    path: 'adherent.cours2',
    populate: {
      path: 'prof'
    }
  })
  .then(function(user){
    res.render("espacePerso/absence", {user});
  })
  .catch(function (err) { 
    next(err);
  });
});
router.post("/absence", (req, res, next) => {
    let email = req.body.profEmail;
    let message = req.body.message;
    let prenom = req.body.prenom;
  
    let nom = req.body.nom;
    let date = req.body.date;
    let subject = `Absence de ${prenom} ${nom} le ${date}`;
    smtpTransport.sendMail({
      from: 'associationlestrembles@gmail.com',
      to: email, 
      subject: subject, 
      text: message,
      html: `<b>${message}</b>`
    })
    .then(info => res.redirect("/mon-accueil"))
    .catch(error => console.log(error));
});
  
//Facture adherent (private page)
router.get("/facture", (req, res) => {
  if (!req.user) {
    res.redirect('authentication/login'); // not logged-in
    return;
  }
// ok, req.user is defined
// res.render("espacePerso/facture", { user: req.user });
  User.findOne({_id : req.user._id})
  .populate({
    path: 'adherent.cours1',
    populate: {
      path: 'duree'
    }
  })
  .populate({
    path: 'adherent.cours2',
    populate: {
      path: 'duree'
    }
  })
  .then(function(user){
    res.render("espacePerso/facture", {user});
  })
  .catch(function (err) { 
    next(err);
  });
});
router.post("/facture", (req, res) => {
  let email = req.user.email;
  let prenom = req.body.prenom;
  let nom = req.body.nom;
  let tarif = req.body.tarif;
  let date = req.body.date;
  let subject = `Facture ${prenom} ${nom} ${date}`;
  smtpTransport.sendMail({
    from: 'associationlestrembles@gmail.com',
    to: email, //email user
    subject: subject,  
    text: 'message',
    html: templates.templateExample(prenom, nom, tarif, date)
  })
  .then(info => res.redirect("/mon-accueil"))
  .catch(error => console.log(error));
});
    
module.exports = router;