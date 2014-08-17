'use strict';

var Feed = require('feed');
var _ = require('lodash');

var db = require('../lib/database');
var config = require('../config');

var currentYear = new Date().getFullYear();

function rssFeed(req, res){
 //RSS feed
 var feed = new Feed({
   title: config.siteTitle,
   description: config.siteDescription,
   link: config.siteUrl,
     //image: 'image'
     copyright: 'Copyright @' + currentYear + ' ' + config.siteAuthor +'. All rights reserved',

     author: {
       name: config.siteAuthor,
       email: config.siteAuthorEmail,
       link: config.siteUrl
     }
 });

 db('content')
    .where({
      type: 'post'
    })
    .orderBy('created_at', 'DESC')
    .limit(10)
    .then(function(posts){
      _.forEach(posts, function(post){
       feed.addItem({
         title: post.title,
         link: config.siteUrl + '/' + post.slug,
         description: post.body,
         date: post.created_at
       });
      });
      res.set('Content-Type', 'application/rss+xml');
      res.send(feed.render('rss-2.0'));
    });
}

module.exports = rssFeed;
