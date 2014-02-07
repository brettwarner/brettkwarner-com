var BlogPost = require('./models/posts');
var BlogPage = require('./models/pages'); 
var marked = require('marked');
var Feed = require('feed');
var ensureAuthenticated = require('./ensureAuthenticated');

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
// Adds a new post!
module.exports = function(app){
	
	app.get('/', function(req,res){
		BlogPost.find(function(err, thePosts){
			console.log(thePosts);
			res.render("index", {title: "DinoLand", test1: "Test Here", posts: thePosts, user: req.user});
		});
	});

	// Add a post page

	app.get('/admin/createnew', ensureAuthenticated, function(req,res){
		res.render("admin", {title: 'Success!', user: req.user});
	});

	app.post('/api/addcontent', ensureAuthenticated, function(req, res){

		console.log("Adding Something Awesome!");
		console.log(req.body);
		if(req.body['content-type'] === "post"){
			console.log("content type post");
			BlogPost.create({
				postName: req.body['content-title'],
				postSlug: req.body['content-slug'],
				postDate : new Date(),
				postAuthor : "Brett Warner",
				postBody: marked(req.body['content-body']),
				postMarkdown: req.body['content-body']
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
				pageBody: marked(req.body['content-body']),
				pageMarkdown: req.body['content-body']
			}, function(err, success){
				if(err)
					res.send(err);
				BlogPage.find(function(err,pages){
					res.send(pages);
				})
			});
		}
	});

	//Edits a piece of content needs to be done still
	app.post("/api/editcontent", function(req, res){
		console.log("Editing a Piece of Content!")
	});

	//Deletes a post needs to be done still
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
					description: thePosts[blogPost].postBody,
					date: thePosts[blogPost].postDate
				});
			}
	      	//res.set('Content-Type', 'text/xml');
	      	res.set('Content-Type', 'application/rss+xml');
            // Sending the feed as a response
            res.send(feed.render('rss-2.0'));
        });
	});

	// Pulls a page based on the slug
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

	// Page number code I'm working on.
	// Thought is to display 10 post titles per,
	// Pass next and previous buttons through as true/false values based on numbers
	// Pass

	// app.get('/page/:pnumber', function(req, res){
	//	var pageNumber = parseInt(req.params.pnumber);
	//  if (typeof(pageNumber) !== integer){
		// Return not found
	//}else if // page number out of range
	//return not found
	//}else{
		//return blog page
//	}
	// 	BlogPage.findOne({ pageSlug: req.params.pageSlug}, function(err, thePage){
	// 		if(!thePage){
	// 			console.log("the error" + err);
	// 			res.send("Not found");
	// 		}else{
	// 			console.log(thePage);
	// 			console.log(req.params.pageTitle);
	// 			res.render("page", {title: thePage.pageName, body: thePage.pageBody});
	// 		}
	// 	});
	// });

	// Pulls a post based on the slug.
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



