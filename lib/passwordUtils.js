const bcrypt = require('bcryptjs');

// Generate hashed password
async function genPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

// Check password against hashed value
async function validPassword(password, hashedPassword) {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
