'use strict';

var handlers = require('require-dir')(__dirname + '/handlers');

function routes(app){

  app.get('/', handlers.index);
  app.get('/page/:pageNum', handlers.index);
  app.get('/rss', handlers.rss);
  app.get('/:slug', handlers.single);
  app.get('/blog/:slug', handlers.single);
  app.get('/admin/edit/:type-:slug', handlers.editor);
  app.get('/admin/createnew', function(req, res){
    // Admin Page
    res.render('admin', { title: 'Success!', user: req.user });
  });

  // APIs
  app.post('/api/addcontent', handlers.addContent);
  app.post('/api/editcontent', handlers.editContent);
  app.post('/api/delete', function(req, res){
   //TODO
   console.log('Deleting a Post!');
  });
}

module.exports = routes;
