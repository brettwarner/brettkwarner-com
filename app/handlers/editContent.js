'use strict';

var BlogPage = require('../models/pages');
var BlogPost = require('../models/posts');
var marked = require('marked');

module.exports = function(req, res){
	//Edits a piece of content

	if(req.body['content-type'] === 'post'){

		BlogPost.update({postSlug: req.body['content-slug']},{
			postName: req.body['content-title'],
			postBody: marked(req.body['content-body']),
			postMarkdown: req.body['content-body']
		}, function(err, thePost){
			if(!thePost){
				console.log('The error' + err);
				res.send('Post Not found');
			}else{
				console.log(thePost);
				res.send('Post Updated!');
			}
		});
	}

	if(req.body['content-type'] === 'page'){

		BlogPage.update({pageSlug: req.body['content-slug']},{
			pageName: req.body['content-title'],
			pageBody: marked(req.body['content-body']),
			pageMarkdown: req.body['content-body']
		}, function(err, thePage){
			if(!thePage){
				res.send('Page Not found');
			} else {
				res.send('Page Updated!');
			}
		});

	}
	res.send('Not Found!');
};
