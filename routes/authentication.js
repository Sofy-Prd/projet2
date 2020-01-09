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
}));




router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;