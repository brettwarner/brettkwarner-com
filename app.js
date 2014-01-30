
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
app.get('/posts/:postSlug', function(req,res){

	BlogPost.findOne({ postSlug: req.params.postSlug }, function(err, thePost){
		if(!thePost){
			console.log("The error"+ err);
			res.send('Not found');
		}else{
			console.log(thePost);
			console.log(req.params.postTitle);
			res.render("post", {title: thePost.postName, body: thePost.postBody});
		}
	});
});
//app.get("/", routes.index)
//app.get('/users', user.list);


// Weird Error Handling Code I stole from here:
//

// "app.router" positions our routes
// above the middleware defined below,
// this means that Express will attempt
// to match & call routes _before_ continuing
// on, at which point we assume it's a 404 because
// no route has handled the request.

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.


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

// End of Weird Error Handling code

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
