'use strict';

var db = require('../lib/database');
var marked = require('marked');

function editContent(req, res){

  db('content')
    .where({ slug: req.body['content-slug'] })
    .update({
      title: req.body['content-title'],
      body: marked(req.body['content-body']),
      markdown: req.body['content-body']
    })
    .then(function(content){
      res.send('Content Updated!');
    })
    .otherwise(function(err){
      console.log('The error' + err);
      res.send('Post Not found');
    });
}

module.exports = editContent;
