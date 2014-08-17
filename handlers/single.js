'use strict';

var db = require('../lib/database');

function single(req, res){

  var contentType = 'page';

  if(req.route.path === '/blog/:slug'){
    contentType = 'post';
  }

  db('content')
    .select('*')
    .where({
      slug: req.params.slug,
      type: contentType
    })
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
