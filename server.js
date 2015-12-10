// SERVER-SIDE JAVASCRIPT

// REQUIREMENTS //
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var db = require("./models/index");
var session = require("express-session");


app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'CatsAndPenguins',
  cookie: { maxAge: 30 * 60 * 1000 }
}));
// express-session has a touch option to update max age

app.get('/', function(req, res) {
console.log('session', req.session);
  	res.render( 'index', { title : 'Express Todo Example'});
});

// app.get('/', function(req, res) {
// console.log('session', req.session);
//   yelp.request_yelp({ term: req.query.term }, function(err, response, body) {
//   	db.User.findOne({_id: req.session.userId}, function(err, user){
//   	  	res.render("index", { yelpResults: body, user: user });
//   	  });
//   });
// });



// app.post('/search', function(req, res) {
// 	var term = req.body.term;
// 	console.log(term);
// 	yelp.request_yelp({ term: term },function (err, response, yelpResults) {

// 		// find all of the users with a given allergy
// 		// combine inputs from form into allergies array
// 		// pass allergies array to find(), investigate how to find 1 or more matching allergies

// 		db.User.find({allergies: ''}, function(err, users) { 

// 		// then console log the allergies and reviews for those users
// 			users.forEach(function(user) { 
// 				console.log(user.allergies, user.reviews); 
// 			}); 
// 		});

// 		db.User.find().populate('reviews').exec( function (error, users) {
// 			if(error) {
// 				console.log('The error is ', error);
// 			}
// 			console.log('the users are :', users);
// 			 res.send({
// 			 			yelpResults: yelpResults, 
// 			 			users: users
// 			});
// 		});
// 	});
// });

app.get('/:yelp_id/addReview', function (req, res){
	// logic to figure if a user is logged in or not
	// if no user is logged in redirect them to a sign up page or a login 
	//login page would be something like /login
	// sign up would be /signup
});


// app.post('/loginPost', function (req, res){
// 	// login a user into session 
// 	// i need to build a session helper

// });

app.get('/signup', function (req, res){
	// renders a sign up form
	res.render('signup');

});

app.post('/signupUser', function (req, res){
	var newUser = req.body; 
	// create a user and save into my mongoose
	console.log(newUser);
	db.User.createSecure(newUser.email, newUser.password, function(err, user) {
		console.log('omg', err);
		req.session.userId = user._id;
		req.session.user = user;
		res.json(user);
	
	});
});

// show the login form
app.get('/login', function (req, res) {
  res.render('login');
});

// authenticate the user and set the session
app.post('/sessions', function (req, res) {
	console.log('body:',req.body);
  // call authenticate function to check if password user entered is correct
  db.User.authenticate(req.body.email, req.body.password, function (err, loggedInUser) {
    if (err){
      console.log('authentication error: ', err);
      res.status(500).send();
    } else {
      console.log('setting sesstion user id ', loggedInUser._id);
      req.session.userId = loggedInUser._id;
      res.redirect('/');
    }
  });
});


app.get('/logout', function (req, res) {
  // remove the session user id
  req.session.userId = null;
  // redirect to login (for now)
  res.redirect('/login');
});

// app.post('/:yelp_id/createReview', function (req, res){
// 	// save the req.body into the proper user -> reviews array
// });

app.listen(process.env.PORT || 3000);