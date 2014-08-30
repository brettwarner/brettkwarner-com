'use strict';

var http = require('http');
var path = require('path');
var express = require('express');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

//Express Middleware
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var expressSession = require('express-session');

var config = require('./config');
var errorHandler = require('./handlers/error');
var db = require('./lib/database');
var serializeUser = require('./lib/serializeUser');
var deserializeUser = require('./lib/deserializeUser');
var authenticationStrategy = require('./lib/authenticationStrategy');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
passport.use(new localStrategy(authenticationStrategy));

require('./routes.js')(app, passport);

app.use(errorHandler);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

