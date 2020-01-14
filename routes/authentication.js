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

//generer envoi email avec nouveau de passe - fonction random()
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
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', // se puede usar cualquier otro servicio soportado por nodemailer, see nodemailer support mail SMTP
        auth: {
          user: process.env.LOGINASSOS, //email from
          pass: process.env.GMAILSECRET //password 
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'les Trembles',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/modifPwdBis/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/oubliPwd');
  });

});





      // var smtpTransport = nodemailer.createTransport('SMTP', {
      //   service: 'Gmail', 
      //   auth: {
      //     user: process.env.LOGINASSOS, //email from
      //     pass: process.env.GMAILSECRET //password 
      //   }
      // });

// let transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.LOGINASSOS, 
//       pass: process.env.GMAILSECRET 
//     }
//   });

//   transporter.sendMail({
//     from: 'associationlestrembles@gmail.com',
//     to: user.email, 
//     subject: 'Réinitialisation de votre Mot de Passe', 
//     text: 'message',
//     html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//           'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//           'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//           'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//   })
//  ], function(err) {
//     if (err) return next(err);
//     res.redirect('/oubliPwd');
//   });




// 'Réinitialisation de votre Mot de Passe',
      //   text: 'Vous recevez cet email parce que vous ou quelqu\'un d\'autre avez demandé la réinitialisation du mot de passe de votre compte\. Veuillez cliquer sur le lien suivant ou le coller dans votre navigateur pour terminer le processus :\n+\.
      //     http://' + req.headers.host + '/reset/' + token + '\n\n' +
      //     'Si vous ne l\'avez pas demandé, veuillez ignorer cet e-mail et votre mot de passe restera inchangé.\n'


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// router.get('/modifPwdBis', (req, res) => {
//   res.render('authentication/modifPwdBis',{ user: req.user });
// });



router.get('/modifPwdBis/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/oubliPwd');
    }
    console.log(user);
    res.render('authentication/modifPwdBis', {
      user
    });
  });
});


router.post("/modifPwdBis/:token", (req, res, next) => { 

  if (user) {
    const password1 = req.body.password1;
    const password2 = req.body.password2;
    const salt = bcrypt.genSaltSync(bcryptSalt);

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

    const hashPassNew = bcrypt.hashSync(req.body.password1, salt);
    const user = user;
    user.modifPwd = false;
    user.password = hashPassNew;
    user.save()
      .then(user => {
        console.log("mdp modifié");
        res.redirect('/login')})
      .catch(err => next(err))
      ;
  }
});

// , resetPasswordExpires: { $gt: Date.now() }
module.exports = router;