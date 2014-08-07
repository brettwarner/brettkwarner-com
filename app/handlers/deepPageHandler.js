'use strict';

var BlogPost = require('../models/posts');
module.exports = function(req, res){
	//Returns new index based on page num
	var currentPage = +req.params.pageNum;
	var start = ((currentPage-1) * 10) + 1;
	var end = (currentPage * 10);
	if(typeof(start) !== 'number'){
		console.log(start);
		res.send('Not Found');
	} else {
		BlogPost.find().sort({postDate: -1}).skip(start).limit(end).exec(function(err, thePosts){

			for(var post in thePosts){
				var cleanDate = thePosts[post].postDate.toString().split(' ');
				cleanDate = cleanDate[0] + ' ' + cleanDate[1] + ' ' + cleanDate[2] + ' ' + cleanDate[3];
				thePosts[post].cleanDate = cleanDate;
			}

			var pageData = {
				title: 'DinoLand',
				test1: 'Test Here',
				posts: thePosts,
				user: req.user,
				currentPage: currentPage,
				nextPage: currentPage+1,
				prevPage: currentPage-1
			};

			res.render('index', pageData);
		});
	}
};
