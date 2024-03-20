const express = require('express');
const router = express.Router();
const User = require('../models/user');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

// Sign-up form page
router.get('/sign-up', (req, res, next) => {
  res.render('signup_form', { title: 'Sign up' });
});

// Sign-up post
router.post('/sign-up', (req, res, next) => {
  res.send('Not implemented POST sign-up page');
});

// Login get page
router.get('/login', (req, res, next) => {
  res.send('Not implemented GET login page');
});

// Login post page
router.post('/login', (req, res, next) => {
  res.send('not implemented POST login page');
});
module.exports = router;
