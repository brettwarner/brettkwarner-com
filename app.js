
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


var monOptions = {
  server:{
    auto_reconnect: true,
      poolSize: 10,
      socketOptions:{
      keepAlive: 1
    }
  },
  db: {
    numberOfRetries: 10,
    retryMiliSeconds: 1000
  }
}

mongoose.connect(database.url, monOptions);

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

// RSS Feed
app.get('/rss', function(req, res){
	BlogPost.find(function(err, thePosts){
		console.log("Grabb Rss feed")
		console.log(thePosts);
		res.render("rss2", {posts: thePosts})
	});
});


app.get('/:pageSlug', function(req, res){

	BlogPage.findOne({ pageSlug: req.params.pageSlug}, function(err, thePage){
		if(!thePage){
			console.log("the error" + err);
			res.send("Not found");
		}else{
			console.log(thePage);
			console.log(req.params.pageTitle);
			res.render("page", {title: thePage.pageName, body: thePage.pageBody});
		}
	});
});
// This is what I'm currently working on. Will pull a post based on title.
app.get('/blog/:postSlug', function(req,res){

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

// End of Weird Error Handling code

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
