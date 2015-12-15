// SERVER-SIDE JAVASCRIPT

// REQUIREMENTS //
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var db = require("./models/index");
var session = require("express-session");

// Setting up App
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'CatsAndPenguins',
  cookie: { maxAge: 60 * 120 * 2000 }
}));

// express-session has a touch option to update max age
// landing

//Login Signup Routes
app.get('/', function(req, res) {
  res.render("index");
});

app.get('/signup', function (req, res) {
  res.render('signup');
});

app.post('/user', function (req, res) {
  console.log(req.body);
  db.User.createSecure(req.body.email, req.body.password, function (err, newUser) {
    req.session.userId = newUser._id;
    if(err){
      console.log(err);
    } else {
      res.json(newUser);
    }
  });
});

// authenticate the user and set the session
app.post('/sessions', function (req, res) {
  console.log('attempted signin: ', req.body);
  // call authenticate function to check if password user entered is correct
  db.User.authenticate(req.body.email, req.body.password, function (err, loggedInUser) {
    if (err){
      console.log('authentication error: ', err);
      res.status(500).send();
      res.redirect('/');
    } else {
      console.log('setting session user id ', loggedInUser._id);
      req.session.userId = loggedInUser._id;
      if(err){
        console.log(err);
      } else {
        res.json(loggedInUser);
      }
      //res.redirect('/chatcenter');
    }
  });
});

//loged in main page
// shows all chats
app.get('/eventcenter', function (req, res) {
  console.log('session user id: ', req.session.userId);
  // find the user currently logged in
  db.User.findOne({_id: req.session.userId}, function (err, currentUser) {
    if (err){
      console.log('database error: ', err);
      res.redirect('/');
    } else {
      // render profile template with user's data
      console.log('loading profile of logged in user: ', currentUser);
  }
  db.Event.find({}, function(err, events){
    if (err) { res.json(err); }
      console.log("events to load for events-index", events);
    res.render('events-index',{events: events, user: currentUser});
  });
});
});

app.get('/logout', function (req, res) {
  // remove the session user id
  req.session.userId = null;
  // redirect to login (for now)
  res.redirect('/');
});

//Rotues for Main App
app.get('/event/new', function (req, res){
  res.render('event-create')
})
app.post('/events', function (req, res){ 
  //console.log(req.body);
  db.Event.create(req.body, function(err, event){
    if(err) {
      res.json(err);
    } else {
      //console.log(chat);
      res.json(event);
    } 
  });
});
app.get('/events/:_id', function (req, res){
  console.log(req.params);
  db.Event.findById(req.params._id).populate('rsvp').exec(function (err, event){
    if (err) {
      res.json(err);
    }else{
      res.render('event-show', {event: event});
    }
  });
});

//should not be an delete route, will need to change in the future
app.delete('/events/:_id', function (req, res){
  //console.log("chat id is", req.params);
  db.Event.find({
    _id: req.params._id
  }).remove(function(err, event){
  //  console.log("Chat Removed");
    res.json("Event Gone?");
  });
});

app.get('/profile', function (req, res){
  console.log(req.params);
  db.User.findById(req.session.userId).populate('profile').exec(function (err, profile){
    if (err) {
      res.json(err);
    }else{
      res.render('profile', {profile: profile});
    }
  })
})

app.listen(process.env.PORT || 3000);