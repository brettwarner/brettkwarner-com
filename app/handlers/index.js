'use strict';

var db = require('../../lib/database');

function homepage(req, res){

  var currentPage = +req.params.pageNum || 1;

  db('content')
    .where({
      type: 'post'
    })
    .orderBy('created_at', 'DESC')
    .offset((currentPage - 1) * 10)
    .limit(10)
    .then(function(posts){
      for(var post in posts){
        var cleanDate = posts[post].created_at.toString().split(' ');
        cleanDate = cleanDate[0] + ' ' + cleanDate[1] + ' ' + cleanDate[2] + ' ' + cleanDate[3];
        posts[post].cleanDate = cleanDate;
      }

      var pageData = {
        title: 'DinoLand',
        test1: 'Test Here',
        posts: posts,
        currentPage: currentPage,
        nextPage: currentPage + 1,
        prevPage: currentPage - 1
        // user: req.user
      };

      res.render('index', pageData);
    });
}

module.exports = homepage;
