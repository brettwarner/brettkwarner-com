'use strict';

var http = require('http');
var path = require('path');
var express = require('express');

//Express Middleware
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var config = require('./config');
var errorHandler = require('./handlers/error');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));

require('./routes.js')(app);
app.use(errorHandler);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

