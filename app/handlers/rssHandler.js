var BlogPost = require('../models/posts');
var Feed = require('feed');
module.exports = function(req, res){
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

	BlogPost.find().sort({postDate: -1}).limit(10).exec(function(err, thePosts){
		for(var blogPost in thePosts){
			feed.addItem({
				title: thePosts[blogPost].postName,
				link: 'http://www.brettkwarner.com/' + thePosts[blogPost].postSlug,
				description: thePosts[blogPost].postBody,
				date: thePosts[blogPost].postDate
			});
		}
			//res.set('Content-Type', 'text/xml');
			res.set('Content-Type', 'application/rss+xml');
			// Sending the feed as a response
			res.send(feed.render('rss-2.0'));
		});
};