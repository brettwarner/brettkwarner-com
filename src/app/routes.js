// This is my awesomely large and disorganized routes file. 
// Started moving all route handlers into their own files. Should make this eaier to read when 100% finished

var BlogPage = require('./models/pages'); 
var marked = require('marked');
var ensureAuthenticated = require('./middleware/ensureAuthenticated');

var homePageHandler = require('./handlers/homePageHandler');
var rssHandler = require('./handlers/rssHandler');
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

module.exports = function(app){

	app.get('/', homePageHandler);

	app.get('/page/:pageNum', function(req, res){
		//Returns new index based on page num
		var currentPage = +req.params.pageNum;
		var start = ((currentPage-1) * 10) + 1;
		var end = (currentPage * 10);
		if(typeof(start) !== 'number'){
			console.log(start);
			res.send('Not Found');
		}else{ 
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
	});
	app.get('/admin/createnew', ensureAuthenticated, function(req,res){
		// Admin Page

		res.render('admin', {title: 'Success!', user: req.user});
	});
	app.post('/api/addcontent', ensureAuthenticated, function(req, res){
		// API to Add content
		console.log('Adding Something Awesome!');
		console.log(req.body);
		if(req.body['content-type'] === "post"){
			console.log("content type post");
			BlogPost.create({
				postName: req.body['content-title'],
				postSlug: req.body['content-slug'],
				postDate : new Date(),
				postAuthor : 'Brett Warner',
				postBody: marked(req.body['content-body']),
				postMarkdown: req.body['content-body']
			}, function(err, success){
				if(err)
					res.send(err);
				BlogPost.find(function(err, posts){
					res.send(posts);
				});
			});
		}else if(req.body['content-type'] ==="page"){
			console.log('content type page');
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
				});
			});
		}
	});

app.get('/rss', rssHandler);


app.get('/:pageSlug', function(req, res){
		// Pulls a page based on the slug

		BlogPage.findOne({ pageSlug: req.params.pageSlug}, function(err, thePage){
			if(!thePage){
				console.log('the error' + err);
				res.send('Not found');
			}else{
				var pageData = {
					title: thePage.pageName, 
					body: thePage.pageBody, 
					slug: req.params.pageSlug, 
					user: req.user
				};

				res.render('page', pageData);
			}
		});
	});


app.get('/blog/:postSlug', function(req,res){
		// Pulls a post based on the slug.

		BlogPost.findOne({ postSlug: req.params.postSlug }, function(err, thePost){
			if(!thePost){
				console.log("The error"+ err);
				res.send('Not found');
			}else{
				
				var pageData = {
					title: thePost.postName, 
					slug: req.params.postSlug, 
					body: thePost.postBody,  
					user: req.user
				};
				
				res.render("post", pageData);
			}
		});
	});


app.post("/api/editcontent", function(req, res){
		//Edits a piece of content 

		if(req.body['content-type'] === "post"){
			console.log("This is a post!");

			BlogPost.update({postSlug: req.body['content-slug']},{
				postName: req.body['content-title'],
				postBody: marked(req.body['content-body']),
				postMarkdown: req.body['content-body']
			}, function(err, thePost){
				if(!thePost){
					console.log("The error"+ err);
					res.send('Post Not found');
				}else{
					console.log(thePost);
					res.send('Post Updated!');
				}
			});
		}else if(req.body['content-type'] ==="page"){

			BlogPage.update({pageSlug: req.body['content-slug']},{
				pageName: req.body['content-title'],
				pageBody: marked(req.body['content-body']),
				pageMarkdown: req.body['content-body']
			}, function(err, thePage){
				if(!thePage){

					res.send('Page Not found');
				}else{

					res.send('Page Updated!');
				}
			});

		}else{
			console.log("Unknown content type");
			res.send("Type Not Found!");
		}
		
	});


app.post("/api/delete", function(req, res){
		//Deletes a post needs to be done still

		console.log("Deleting a Post!");
	});


app.get('/admin/edit/:type-:slug', ensureAuthenticated, function(req, res){
		// Edits a post or page based on type passed through!

		console.log(req.params.type);
		console.log(req.params.slug);
		if(req.params.type === 'post'){
			console.log('This is a post!');

			BlogPost.findOne({postSlug: req.params.slug}, function(err, thePost){
				if(!thePost){
					console.log("The error"+ err);
					res.send('Post Not found');
				}else{
					var pageData = {
						title: thePost.postName, 
						content: thePost.postMarkdown, 
						slug: thePost.postSlug, 
						type: 'post',  
						user: req.user
					};

					res.render("editor", pageData);
				}
			});

		}else if(req.params.type ==='page'){
			console.log('this is a page!');

			BlogPage.findOne({pageSlug: req.params.slug}, function(err, thePage){
				if(!thePage){
					console.log('The error'+ err);
					res.send('Page Not found');
				}else{

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

		}else{
			res.send('Type Not Found!');
		}
	});
};



