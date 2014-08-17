'use strict';

var db = require('../lib/database');

function single(req, res){
  // Pulls a page based on the slug
  //TODO: Only grab posts on /blog/slug, otherwise grab page on /slug

  db('content')
    .select('*')
    .where({ slug: req.params.slug })
    .limit(1)
    .spread(function(content){
      var pageData = {
       title: content.title,
       body: content.body,
       slug: req.params.slug,
       // user: req.user
     };
     res.render('page', pageData);
    })
    .otherwise(function(err){
      console.log(err);
      res.send('Not Found');
    });
}

module.exports = single;
