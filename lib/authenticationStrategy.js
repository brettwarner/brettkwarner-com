'use strict';

var db = require('./database');

var isValidPassword = require('./isValidPassword');

function authenticationStrategy(username, password, done){
  db('users').where({ username: username })
      .select('username', 'password', 'id')
      .spread(function(user){
        if(!user){
          return done(null, false, { message: 'Invalid Username or Password' });
        }
        if(!isValidPassword(user, password)){
          return done(null, false, { message: 'Invalid Username or Password' });
        }
        return done(null, user);
      });
}

module.exports = authenticationStrategy;
