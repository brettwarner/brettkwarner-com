'use strict';

//Handlers
var indexHandler = require('./handlers/index');
var rssHandler = require('./handlers/rss');
var addContentHandler = require('./handlers/addContent');
var singleHandler = require('./handlers/single');
var editContentHandler = require('./handlers/editContent');
var editorHandler = require('./handlers/editor');

// Routes!
module.exports = function(app){

  app.get('/', indexHandler);
  app.get('/page/:pageNum', indexHandler);
  app.get('/rss', rssHandler);
  app.get('/:slug', singleHandler);
  app.get('/blog/:slug', singleHandler);
  app.get('/admin/edit/:type-:slug', editorHandler);
  app.get('/admin/createnew', function(req, res){
    // Admin Page
    res.render('admin', { title: 'Success!', user: req.user });
  });

  // APIs
  app.post('/api/addcontent', addContentHandler);
  app.post('/api/editcontent', editContentHandler);
  app.post('/api/delete', function(req, res){
   //Deletes a post needs to be done still
   console.log('Deleting a Post!');
  });

};
