'use strict';

var BlogPost = require('../models/posts');
var BlogPage = require('../models/pages');
module.exports = function(req,res){
	//Show post and page list. Homepage!

	BlogPost.find().sort({postDate: -1}).limit(10).exec(function(err, thePosts){

		// Change Dates to a more reasonable format
		for(var post in thePosts){
			var cleanDate = thePosts[post].postDate.toString().split(' ');
			cleanDate = cleanDate[0] + ' ' + cleanDate[1] + ' ' + cleanDate[2] + ' ' + cleanDate[3];
			thePosts[post].cleanDate = cleanDate;
		}

		//Construct the data to go out to the site
		var pageData = {
			title: 'DinoLand',
			test1: 'Test Here',
			posts: thePosts,
			user: req.user
		};


		res.render('index', pageData);
	});
};
