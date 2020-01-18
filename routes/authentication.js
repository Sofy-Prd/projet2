const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/famille');
const bcryptSalt = 10;
var async = require('async');
var crypto = require('crypto');
const flash = require('connect-flash');
const nodemailer  = require('nodemailer');
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

//Login GET
router.get('/login', (req, res) => {
  res.render('authentication/login', { message: req.flash('error')});
});
//Login POST
router.post('/login', passport.authenticate('local', {
  successRedirect : '/mon-accueil',
  failureRedirect : '/login',
  failureFlash : 'Invalid username or password.'
  }
));
//Routes pour réinitialiser le mot de passe à la 1ère connexion
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
    const user = req.user;
    user.modifPwd = false;
    user.password = hashPassNew;
    user.save()
      .then(user => {
        console.log("mdp modifié");
        res.redirect('/mon-accueil')})
      .catch(err => next(err))
      ;
  }
});
//Génerer envoi email avec token pour mdp oublié
router.get('/oubliPwd', (req, res) => {
  res.render('authentication/oubliPwd', { user: req.user });
});
router.post('/oubliPwd', (req, res, next) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/oubliPwd');
        }
     
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var mailOptions = {
        to: user.email,
        from: 'les Trembles',
        subject: 'Réinitialiser votre Mot de Passe',
        text: 'Vous recevez cet email parce que vous avez demandé la réinitialisation du mot de passe de votre compte.\n\n' +
          'Veuillez cliquer sur le lien suivant ou le coller dans votre navigateur pour terminer le processus :\n\n' +
          'http://' + req.headers.host + '/modifPwdBis/' + token + '\n\n' +
          'Si cette demande ne vient pas de vous, veuillez ignorer cet e-mail et votre mot de passe restera inchangé.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'Un email contenant des informations supplémentaires a été envoyé à : ' + user.email );
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/oubliPwd');
  });
});
//Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
//Modifier mdp oublié grâce à un lien contenant le token
router.get('/modifPwdBis/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/oubliPwd');
    }
    res.render('authentication/modifPwdBis', {
      user
    });
  });
});
router.post("/modifPwdBis/:token", (req, res, next) => { 
  const password1 = req.body.password1;
  const password2 = req.body.password2;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPassNew = bcrypt.hashSync(req.body.password1, salt);
  //Check password1 and password2 are not empty
    if (password1 === "" || password2 === "" ) {
      console.log ('mdp vide');
      res.render("authentication/modifPwdBis", { errorMessage: "Le mot de passe ne peut pas être vide" });
      return;
    }
  //on verifie que les deux mdp sont identiques
    if (password1 !== password2) {
      res.render("authentication/modifPwdBis", { errorMessage: "Les deux mots de passe ne sont pas identiques" });
      return;
    }
  async.waterfall([
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Le token pour mettre à jour votre mot de passe est invalide ou a expiré.');
        return res.redirect('/login');
      }
      user.password = hashPassNew;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.save()
        .then(user => {
        console.log("mdp modifié");
        res.redirect('/login')})
      .catch(err => next(err));
    })
  ]);
});
module.exports = router;

