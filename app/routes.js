'use strict';

//Middleware
var ensureAuthenticated = require('./middleware/ensureAuthenticated');

//Handlers
var indexHandler = require('./handlers/index');
var rssHandler = require('./handlers/rss');
var addContentHandler = require('./handlers/addContent');
var deepPageHandler = require('./handlers/deepPage');
var singlePageHandler = require('./handlers/page');
var singlePostHandler = require('./handlers/post');
var editContentHandler = require('./handlers/editContent');
var editorHandler = require('./handlers/editor');

// Routes!
module.exports = function(app){

	app.get('/', indexHandler);
	app.get('/page/:pageNum', deepPageHandler);
	app.get('/rss', rssHandler);
	app.get('/:pageSlug', singlePageHandler);
	app.get('/blog/:postSlug', singlePostHandler);
	app.get('/admin/edit/:type-:slug', ensureAuthenticated, editorHandler);
	app.get('/admin/createnew', ensureAuthenticated, function(req, res){
		// Admin Page
		res.render('admin', { title: 'Success!', user: req.user });
	});

	// APIs
	app.post('/api/addcontent', ensureAuthenticated, addContentHandler);
	app.post('/api/editcontent', ensureAuthenticated, editContentHandler);
	app.post('/api/delete', function(req, res){
		//Deletes a post needs to be done still
		console.log('Deleting a Post!');
	});
};
