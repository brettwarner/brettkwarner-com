
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
var BlogPage = require('./app/models/pages');
var BlogPost = require('./app/models/posts');
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
	BlogPost.find(function(err, thePosts){
		console.log(thePosts);
		res.render("index", {title: "DinoLand", test1: "Test Here", posts: thePosts});
	});
});


// This is what I'm currently working on. Will pull a post based on title.
app.get('/posts/:postTitle', function(req,res){

	var actualTitle = req.params.postTitle.split("-").join(" ");
	BlogPost.findOne({ postName: actualTitle }, function(err, thePost){
		console.log("The error"+ err);
		console.log(thePost);
		console.log(req.params.postTitle);
		res.render("post", {title: thePost.postName, body: thePost.postBody});
	});
});
//app.get("/", routes.index)
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
