'use strict';

var config = require('../config');

var database = require('knex')({
  client: 'pg',
  connection: config.databaseUrl
});

module.exports = database;
