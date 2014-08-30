'use strict';

var bcrypt = require('bcrypt');

function isValidPassword(user, password){
  return bcrypt.compareSync(password, user.password);
}

module.exports = isValidPassword;
