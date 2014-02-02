var BlogPost = require('./models/posts');
var BlogPage = require('./models/pages'); 
var marked = require('marked');

// Adds a new post!
module.exports = function(app){
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
}
