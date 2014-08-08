'use strict';

var BlogPage = require('../models/pages');
var BlogPost = require('../models/posts');
var marked = require('marked');

module.exports = function(req, res){
	// API to Add content

	if(req.body['content-type'] === 'post'){
		console.log('content type post');

    var postDetails = {
      postName: req.body['content-title'],
      postSlug: req.body['content-slug'],
      postDate : new Date(),
      postAuthor : 'Brett Warner',
      postBody: marked(req.body['content-body']),
      postMarkdown: req.body['content-body']
    };

		BlogPost.create(postDetails, function(err, success){
			if(err)
				res.send(err);
			BlogPost.find(function(err, posts){
				res.send(posts);
			});
		});
	}

  if(req.body['content-type'] ==='page'){
		console.log('content type page');

    var pageDetails = {
      pageName: req.body['content-title'],
      pageSlug: req.body['content-slug'],
      pageDate : new Date(),
      pageAuthor : 'Brett Warner',
      pageBody: marked(req.body['content-body']),
      pageMarkdown: req.body['content-body']
    };

		BlogPage.create(pageDetails, function(err, success){
			if(err) {
				res.send(err);
			}

			BlogPage.find(function(err,pages){
				res.send(pages);
			});
		});
	}
};
