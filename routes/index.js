const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { genPassword } = require('../lib/passwordUtils');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Message = require('../models/message');
const passport = require('passport');
const isAuth = require('./authMiddleware').isAuth;

/* GET home page. */
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const messages = await Message.find({})
      .populate('user')
      .sort({ timeStamp: -1 })
      .exec();

    res.render('index', { messages: messages });
  })
);

// Sign-up form page
router.get('/sign-up', (req, res, next) => {
  res.render('sign-up-form', { title: 'Sign up' });
});

// Sign-up post
router.post('/sign-up', [
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name field must not be empty')
      .isLength({ min: 1, max: 18 })
      .withMessage('Must be 1 - 18 characters long')
      .escape(),

    body('surname')
      .trim()
      .notEmpty()
      .withMessage('Surname field must not be empty')
      .isLength({ min: 1, max: 18 })
      .withMessage('Must be 1 - 18 characters long')
      .escape(),

    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username field must not be empty')
      .isEmail()
      .withMessage('Username must be a valid email address')
      .custom(async (value) => {
        const existingUser = await User.findOne({ username: value });
        if (existingUser) {
          throw new Error('Email is already in use');
        }
      })
      .escape(),

    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password field must not be empty')
      .isLength({ min: 5 })
      .withMessage('Password must have at least 5 characters')
      .escape(),

    body('confirmPassword')
      .trim()
      .notEmpty()
      .withMessage('Confirm Password field must not be empty')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords must match'),

    // Async handler to handle asynchronous operations
    asyncHandler(async (req, res) => {
      // Hash the password
      const hashedPassword = await genPassword(req.body.password);

      // Create new user object with hashed password

      const user = new User({
        firstName: req.body.name,
        lastName: req.body.surname,
        username: req.body.username,
        password: hashedPassword,
        memberStatus: false,
        admin: false,
      });

      // Validate the user input
      const errors = validationResult(req);
      // If there are validation errors, render the signup form with error messages
      if (!errors.isEmpty()) {
        return res.render('sign-up-form', {
          title: 'Sign up',
          input: user,
          errors: errors.array(),
        });
      }

      // Save the user to the database

      await user.save();
      // Redirect the user to the home page after successful registration
      return res.redirect('/');
    }),
  ],
]);

// Login get page
router.get('/login', (req, res, next) => {
  res.render('login-form', { title: 'Welcome Back! Login to Your Account' });
});

// Login post page
router.post('/login', [
  body('username').trim().escape(),
  body('password').trim().escape(),

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }),
  (req, res, next) => {
    res.send('not implemented POST login page');
  },
]);

// Log out post page
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// Become member GET secret page
router.get('/secret-page', (req, res, next) => {
  res.render('secret-page', {
    title: 'Unlock Your Membership: Enter the Secret Realm',
  });
});

// Become member POST secret page
router.post('/secret-page', [
  body('secret').trim().notEmpty().toLowerCase().escape(),

  asyncHandler(async (req, res) => {
    console.log(req.body);
    if (req.body.secret === 'kitty' && req.isAuthenticated()) {
      // if user is logged in and secret is right update its membership
      await User.findByIdAndUpdate(req.user.id, { memberStatus: 'true' });
      res.render('new-member');
    } else {
      res.render('secret-page', {
        title: 'Unlock Your Membership: Enter the Secret Realm',
        error: 'WRONG !!!',
      });
    }
  }),
]);

// New message GET page
router.get('/new-message', (req, res, next) => {
  res.render('create-message-form', { title: 'Compose a New Message' });
});

// New message POST page
router.post('/new-message', [
  body('title').trim().notEmpty().escape(),
  body('text').trim().notEmpty().escape(),

  asyncHandler(async (req, res, next) => {
    const message = new Message({
      user: req.user.id,
      title: req.body.title,
      text: req.body.text,
      timeStamp: Date.now(),
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('create-message-form', { errors: errors.array() });
      return;
    } else {
      const newMessage = await message.save();
      res.redirect('/');
    }
  }),
]);

// Delete message POST
router.post(
  '/delete-message/:id',
  asyncHandler(async (req, res, next) => {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    res.redirect('/');
  })
);

module.exports = router;
