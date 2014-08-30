'use strict';

function serializeUser(user, done) {
  done(null, user.id);
}

module.exports = serializeUser;
