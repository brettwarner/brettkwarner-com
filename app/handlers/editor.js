'use strict';

var BlogPage = require('../models/pages');
var BlogPost = require('../models/posts');
module.exports = function(req, res){
	// Edits a post or page based on type passed through!

	if(req.params.type === 'post'){
		console.log('This is a post!');

		BlogPost.findOne({postSlug: req.params.slug}, function(err, thePost){
			if(!thePost){
				console.log('The error' + err);
				res.send('Post Not found');
			} else {
				var pageData = {
					title: thePost.postName,
					content: thePost.postMarkdown,
					slug: thePost.postSlug,
					type: 'post',
					user: req.user
				};

				res.render('editor', pageData);
			}
		});
	}

	if(req.params.type === 'page'){
		BlogPage.findOne({pageSlug: req.params.slug}, function(err, thePage){
			if(!thePage){
				console.log('The error'+ err);
				res.send('Page Not found');
			} else {

				var pageData = {
					title: thePage.pageName,
					content: thePage.pageMarkdown,
					slug: thePage.pageSlug,
					type: 'page',
					user: req.user
				};

				res.render('editor', pageData);
			}
		});
	}

	res.send('Type Not Found!');
};
