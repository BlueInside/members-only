const bcrypt = require('bcryptjs');

// TODO

function validPassword(password, hash, salt) {}

async function genPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
