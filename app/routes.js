var BlogPost = require('./models/posts');
var BlogPage = require('./models/pages'); 
var marked = require('marked');

// Adds a new post!
module.exports = function(app){
	marked.setOptions({
		renderer: new marked.Renderer(),
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: true,
		smartLists: true,
		smartypants: false
	});
	app.post('/api/addcontent', function(req, res){
		console.log("Adding Something Awesome!");
		console.log(req.body);
		if(req.body['content-type'] === "post"){
			console.log("content type post");
			BlogPost.create({
				postName: req.body['content-title'],
				postSlug: req.body['content-slug'],
				postDate : new Date(),
				postAuthor : "Brett Warner",
				postBody: marked(req.body['content-body'])
			}, function(err, success){
				if(err)
					res.send(err);
				BlogPost.find(function(err, posts){
					res.send(posts);
				})
			});
		}else if(req.body['content-type'] ==="page"){
			console.log("content type page");
			BlogPage.create({
				pageName: req.body['content-title'],
				pageSlug: req.body['content-slug'],
				pageDate : new Date(),
				pageAuthor : "Brett Warner",
				pageBody: marked(req.body['content-body'])
			}, function(err, success){
				if(err)
					res.send(err);
				BlogPage.find(function(err,pages){
					res.send(pages);
				})
			});
		}
	});

	//Edits a piece of content
	app.post("/api/editcontent", function(req, res){
		console.log("Editing a Piece of Content!")
	});

	//Deletes a post
	app.post("/api/editcontent", function(req, res){
		console.log("Deleting a Post!")
	})
	app.get('/rss', function(req, res){
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

		BlogPost.find(function(err, thePosts){
			for(var blogPost in thePosts){
				feed.addItem({
					title: thePosts[blogPost].postName,
					link: 'http://www.brettkwarner.com' + thePosts[blogPost].postSlug,
					description: 'still testing',
					date: thePosts[blogPost].postDate
				});
			}
		//res.set('Content-Type', 'text/xml');
		res.set('Content-Type', 'application/rss+xml');
        // Sending the feed as a response
        res.send(feed.render('rss-2.0'));
    });
	});


	app.get('/:pageSlug', function(req, res){

		BlogPage.findOne({ pageSlug: req.params.pageSlug}, function(err, thePage){
			if(!thePage){
				console.log("the error" + err);
				res.send("Not found");
			}else{
				console.log(thePage);
				console.log(req.params.pageTitle);
				res.render("page", {title: thePage.pageName, body: thePage.pageBody});
			}
		});
	});

// This is what I'm currently working on. Will pull a post based on title.
app.get('/blog/:postSlug', function(req,res){
	BlogPost.findOne({ postSlug: req.params.postSlug }, function(err, thePost){
		if(!thePost){
			console.log("The error"+ err);
			res.send('Not found');
		}else{
			console.log(thePost);
			console.log(req.params.postTitle);
			res.render("post", {title: thePost.postName, body: thePost.postBody});
		}
	});
});
}
