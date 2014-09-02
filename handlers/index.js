'use strict';

var _ = require('lodash');
var moment = require('moment');

var db = require('../lib/database');

function homepage(req, res){

  var currentPage = +req.params.pageNum || 1;

  db('content')
    .where({
      type: 'post'
    })
    .orderBy('created_at', 'DESC')
    .offset((currentPage - 1) * 10)
    .limit(10)
    .then(function(rawPosts){

      var posts = _.map(rawPosts, function(post){
        post.cleanDate = moment(post.created_at).format('dddd, MMMM Do YYYY');
        return post;
      });

      var pageData = {
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
