const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const { validPassword } = require('../lib/passwordUtils');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Find user in database by username
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      // Use bcrypt compare to check password against hashed password from DB
      const match = await validPassword(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      // All good return user
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
