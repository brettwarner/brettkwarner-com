'use strict';

var db = require('./database');

function deserializeUser(id, done) {
  db('users')
    .where({id: id})
    .select('*')
    .then(function(user){
      done(null, user);
    })
    .otherwise(done);
}

module.exports = deserializeUser;
