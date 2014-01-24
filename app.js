
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var database = require('./config/database');
//var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(database.url);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./app/routes.js')(app);
app.get('/', function(req,res){
	res.render("index", {title: "DinoLand", test1: "Test Here", posts:[{title: "Post 1", body: "Post 1 Body "},{title: "Post2", body: "Post 2 Body"}]});
});

//app.get("/", routes.index)
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
