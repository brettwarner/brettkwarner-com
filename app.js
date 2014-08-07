/**
 * Module dependencies.
 */
var express = require('express');
var mongoose = require('mongoose');
var users = require('./app/models/users.js');
//var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');  
var path = require('path');
var app = express();
var BlogPage = require('./app/models/pages');
var BlogPost = require('./app/models/posts');
var config = require('./config');

var database = config.DBurl;
var hashSecret = config.hashSecret;
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
				return done(null, false, { message: "Incorrect username"});
			}
			if(password !== user.password){
				return done(null, false, {message: "Incorrect password."});
			}
			return done(null, user);
		});
	}
	));
app.post('/admin/login', passport.authenticate('local',
{
	successRedirect: 'admin/createnew',
	failureRedirect: 'admin/login.html'
})
);

mongoose.connect(database, config.monOptions);

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

