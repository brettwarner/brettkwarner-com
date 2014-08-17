'use strict';

var db = require('../lib/database');
var marked = require('marked');

function addContent(req, res){

  var content = {
    type: req.body['content-type'],
    title: req.body['content-title'],
    slug: req.body['content-slug'],
    created_at : new Date(),
    user_id : 1,
    body: marked(req.body['content-body']),
    markdown: req.body['content-body']
  };

  db('content')
    .insert(content)
    .then(function(reult){
      return db('content').select('*');
    })
    .then(function(posts){
      res.send(posts);
    })
    .otherwise(function(err){
      res.send(err);
    });
}

module.exports = addContent;
