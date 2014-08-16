'use strict';

var db = require('../../lib/database');
var Feed = require('feed');

function rssFeed(req, res){
 //RSS feed
 var feed = new Feed({
   title: 'Brett Warner',
   description: 'Stuff I break.',
   link: 'http://www.brettkwarner.com',
     //image: 'image'
     copyright: 'Copyright @ 2014 Brett Warner. All rights reserved',

     author: {
       name: 'Brett Warner',
       email: 'brett@brettkwarner.com',
       link: 'http://www.brettkwarner.com'
     }
 });

 db('content')
    .where({
      type: 'post'
    })
    .orderBy('created_at', 'DESC')
    .limit(10)
    .then(function(posts){
      for(var blogPost in posts){
       feed.addItem({
         title: posts[blogPost].postName,
         link: 'http://www.brettkwarner.com/' + posts[blogPost].slug,
         description: posts[blogPost].body,
         date: posts[blogPost].created_at
       });
      }
      res.set('Content-Type', 'application/rss+xml');
       // Sending the feed as a response
      res.send(feed.render('rss-2.0'));
    });
}

module.exports = rssFeed;
