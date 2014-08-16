'use strict';

var http = require('http');
var path = require('path');
var express = require('express');

var config = require('./config');

// all environments
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.cookieParser());
//TODO: Move into config

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./app/routes.js')(app);

// Error Handling Code I stole from here:
// https://github.com/visionmedia/express/blob/master/examples/error-pages/index.js
app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
   // res.render('404', { url: req.url });
   res.send('Not found');
   return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

