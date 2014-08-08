'use strict';

var BlogPost = require('../models/posts');

module.exports = function(req,res){
	// Pulls a post based on the slug.

	BlogPost.findOne({ postSlug: req.params.postSlug }, function(err, thePost){
		if(!thePost){
			console.log('The error'+ err);
			res.send('Not found');
		} else {

			var pageData = {
				title: thePost.postName,
				slug: req.params.postSlug,
				body: thePost.postBody,
				user: req.user
			};

			res.render('post', pageData);
		}
	});
};
