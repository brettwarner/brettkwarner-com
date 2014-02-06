/**
 * Module dependencies.
 */
 var express = require('express');
 var mongoose = require('mongoose');
 var database = require('./config/database');
 var Feed = require('feed');
 var users = require('./app/models/users.js');
//var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');  
var path = require('path');
var app = express();
var BlogPage = require('./app/models/pages');
var BlogPost = require('./app/models/posts');
var hashSecret = require('./config/hashsecret');
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));


//Passport Stuff
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;

// Not sure if I need this
app.use(express.cookieParser());
app.use(express.session({secret: hashSecret}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router); 

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	users.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(
	function(username, password, done){
		users.findOne({username: username}, function(err, user){
			if(err){ return done(err);}
			if(!user){
				console.log("no user");
				return done(null, false, { message: "Incorrect username"});
			}
			if(password !== user.password){
				console.log("bad pass");
				return done(null, false, {message: "Incorrect password."});
			}
			return done(null, user);
		});
	}
	));

app.post('/admin/login',
	passport.authenticate('local',{ 
		successRedirect: 'admin/createnew',
		failureRedirect: 'admin/login.html',
		// Need to get connect-flash https://github.com/jaredhanson/connect-flash
		// failureFlash: 'Invalid username or password.',
		// successFlash: 'Welcome home!'
	})
	); 

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
		res.render("index", {title: "DinoLand", test1: "Test Here", posts: thePosts, user: req.user});
	});
});

// Add a post page

app.get('/admin/createnew', ensureAuthenticated, function(req,res){
	console.log("okay so we got this far..");
	console.log(req + "success?");	
	res.render("page", {title: 'Success bitches!', user: req.user});
		//res.render("addpost", {title: "Add a post" });
});

// RSS Feed
app.get('/rss', function(req, res){
	var feed = new Feed({
		title: 'Brett Warner',
		description: 'Stuff I break.',
		link: 'http://www.brettkwarner.com',
		//image: 'image'
		copyright: 'Copyright @ 2014 Brett Warner. All rights reserved',

		author: {
			name: 'Brett Warner',
			email: 'brett@brettkwarner.com',
			link: 'http://www.brettkwarner.com'
		}
	});

	BlogPost.find(function(err, thePosts){
		for(var blogPost in thePosts){
			feed.addItem({
				title: thePosts[blogPost].postName,
				link: 'http://www.brettkwarner.com' + thePosts[blogPost].postSlug,
				description: 'still testing',
				date: thePosts[blogPost].postDate
			});
		}
		//res.set('Content-Type', 'text/xml');
		res.set('Content-Type', 'application/rss+xml');
        // Sending the feed as a response
        res.send(feed.render('rss-2.0'));
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
			res.render("page", {title: thePage.pageName, body: thePage.pageBody, user: req.user});
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
			res.render("post", {title: thePost.postName, body: thePost.postBody, user: req.user});
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

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/admin/login')
}
