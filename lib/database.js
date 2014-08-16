'use strict';

var database = require('knex')({
  client: 'pg',
  connection: process.env.POSTGRES
});

module.exports = database;
