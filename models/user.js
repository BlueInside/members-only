const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minLength: 1 },
  lastName: { type: String, required: true, minLength: 1 },
  username: { type: String, required: true, minLength: 1, unique: true }, // Required username which will be email
  password: { type: String, required: true }, // Hashed password
  memberStatus: { type: Boolean, required: true },
});

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
