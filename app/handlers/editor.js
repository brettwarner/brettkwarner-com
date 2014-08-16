'use strict';

var db = require('../../lib/database');

function editor(req, res){

  db('content')
    .select('*')
    .where({ slug: req.params.slug })
    .limit(1)
    .spread(function(content){
      var pageData = {
        title: content.title,
        content: content.markdown,
        slug: content.slug,
        type: content.type,
        // user: req.user
      };

      res.render('editor', pageData);
    })
    .otherwise(function(err){
      console.log(err);
      res.send('Not Found!');
    });
}

module.exports = editor;
