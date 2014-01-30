var BlogPost = require('./models/posts');
var BlogPage = require('./models/pages'); 

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
				postBody: req.body['content-body']
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
				pageDate : new Date(),
				pageAuthor : "Brett Warner",
				pageBody: req.body['content-body']
			}, function(err, success){
				if(err)
					res.send(err);
				BlogPage.find(function(err,pages){
					res.send(pages);
				})
			});
		}
})

	app.post("/api/editcontent", function(req, res){
		console.log("Editing a Piece of Content!")
	})

};