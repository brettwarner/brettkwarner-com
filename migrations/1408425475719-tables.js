'use strict';

var db = require('../lib/database');

exports.up = function(success, error){
  db.schema
  .createTable('users', function(table){
    table.increments();
    table.string('author_name');
    table.string('username');
    table.string('email');
    table.string('password');
    table.timestamps();
  })
  .createTable('content', function(table){
    table.increments();
    table.integer('user_id').references('id').inTable('users');
    table.enu('type', ['post', 'page']);
    table.string('title');
    table.string('slug').unique();
    table.text('body');
    table.text('markdown');
    table.timestamps();
  })
  .then(success)
  .otherwise(error);
};

exports.down = function(success, error){
  db.schema
    .dropTable('content')
    .dropTable('users')
    .then(success)
    .otherwise(error);
};
