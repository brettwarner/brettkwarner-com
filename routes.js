'use strict';

var handlers = require('require-dir')(__dirname + '/handlers');
var ensureAuthenticated = require('./lib/ensureAuthenticated');

function routes(app, passport){

  app.get('/', handlers.index);
  app.get('/page/:pageNum', handlers.index);
  app.get('/rss', handlers.rss);
  app.get('/:slug', handlers.single);
  app.get('/blog/:slug', handlers.single);
  app.get('/admin/edit/:type-:slug', ensureAuthenticated, handlers.editor);
  app.get('/admin/createnew', ensureAuthenticated, handlers.admin);

  // APIs
  app.post('/api/addcontent', ensureAuthenticated, handlers.addContent);
  app.post('/api/editcontent', ensureAuthenticated, handlers.editContent);
  app.post('/api/delete', ensureAuthenticated, function(req, res){
   //TODO
   console.log('Deleting a Post!');
  });

  //passport releated
  function loginHandler(req, res, next){
    passport.authenticate('local', function(err, user, info) {
      if(err){
        return next(err);
      }
      if(!user){
        req.session.messages =  [info.message];
        return res.redirect('/login');
      }
      req.logIn(user, function(err) {
        if(err){
          return next(err);
        }
        return res.redirect('/');
      });
    });
  }

  var authenticationRoutes = {
    successRedirect: 'createnew',
    failureRedirect: 'login.html'
  };

  app.post('/login', loginHandler);
  app.post('/admin/login', passport.authenticate('local', authenticationRoutes));
}

module.exports = routes;
