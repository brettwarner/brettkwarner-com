'use strict';

//Middleware
var ensureAuthenticated = require('./middleware/ensureAuthenticated');

//Handlers
var homePageHandler = require('./handlers/homePageHandler');
var rssHandler = require('./handlers/rssHandler');
var addContentHandler = require('./handlers/addContentHandler');
var deepPageHandler = require('./handlers/deepPageHandler');
var singlePageHandler = require('./handlers/singlePageHandler');
var singlePostHandler = require('./handlers/singlePostHandler');
var editContentHandler = require('./handlers/editContentHandler');
var editorHandler = require('./handlers/editorHandler');

// Routes!
module.exports = function(app){

	app.get('/', homePageHandler);
	app.get('/page/:pageNum', deepPageHandler);
	app.get('/rss', rssHandler);
	app.get('/:pageSlug', singlePageHandler);
	app.get('/blog/:postSlug', singlePostHandler);
	app.get('/admin/edit/:type-:slug', ensureAuthenticated, editorHandler);
	app.get('/admin/createnew', ensureAuthenticated, function(req,res){
		// Admin Page
		res.render('admin', {title: 'Success!', user: req.user});
	});

	// APIs
	app.post('/api/addcontent', ensureAuthenticated, addContentHandler);
	app.post("/api/editcontent", ensureAuthenticated, editContentHandler);
	app.post("/api/delete", function(req, res){
		//Deletes a post needs to be done still
		console.log("Deleting a Post!");
	});
};
