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

// landing
//Login Signup Routes
app.get('/', function(req, res) {
  db.User.findOne({_id: req.session.userId}, function (err, currentUser) {
    if (err) {
      console.log('user not exist:', err);
    }else{
      console.log("user logged in: ", currentUser);
      res.render("index", {user: currentUser});
    }
  });
});

app.post('/user', function (req, res) {
  console.log(req.body);
  db.User.createSecure(req.body.email, req.body.password, function (err, newUser) {
    
    if(err){
      res.json(err);
    } else {
      req.session.userId = newUser._id;
      res.json(newUser);
    }
  });
});

// authenticate the user and set the session
app.post('/sessions', function (req, res) {
  // console.log('attempted signin: ', req.body);
  // call authenticate function to check if password user entered is correct
  db.User.authenticate(req.body.email, req.body.password, function (err, loggedInUser) {
    if (err){
      console.log('authentication error: ', err);
      res.status(500).send();
    } else {
      console.log('setting session user id ', loggedInUser._id);
      req.session.userId = loggedInUser._id;
      if(err){
        console.log(err);
      } else {
        res.json(loggedInUser);
      }
    }
  });
});

//loged in main page
app.get('/eventcenter', function (req, res) {
  db.User.findOne({_id: req.session.userId}, function (err, currentUser) {
    if (err) {
      console.log('user not exist:', err);
      
    }else{
      db.Event.find({}, function(err, events){
        if (err) { res.json(err); }
      // console.log("events to load for events-index", events);
      res.render('events-index',{events: events, user: currentUser});
    });
    }
  });
})

app.get('/logout', function (req, res) {
  // remove the session user id
  req.session.userId = null;
  // redirect to login (for now)
  res.redirect('/');
});

//Routes for Main App
app.get('/event/new', function (req, res){
  db.User.findOne({_id: req.session.userId}, function (err, currentUser) {
    if (err) {
      console.log('user not exist:', err);
    }else{
      // console.log("user logged in: ", currentUser);
      res.render('event-create', {user: currentUser});
    }
  });
});

app.post('/events', function (req, res){ 
  console.log("form submission is:", req.body);
  db.Event.create(req.body, function(err, event){
    if(err) {
      res.json(err);
    } else {
      res.json(event);
    } 
  });
});

app.get('/events/:_id', function (req, res){
  db.User.findOne({_id: req.session.userId}, function (err, currentUser) {
    if (err) {
      console.log('user not exist:', err);
    }
    db.Event.findById(req.params._id).populate('rsvp').exec(function (err, event){
      if (err) {
        res.json(err);
      }else{
        db.Rsvp.findOne({user: req.session.userId, event: req.params._id}, function (err, rsvp){
          if (err){
            console.log(err)
          }
          res.render('event-show', {event: event, user: currentUser, rsvp: rsvp});  
        })
      }
    });
  });
  
});


//should not be an delete route, will need to change in the future
app.delete('/events/:_id', function (req, res){
  console.log("event id is", req.params);
  db.Event.find({
    _id: req.params._id
  }).remove(function(err, event){
  //  console.log("Chat Removed");
  res.json(event);
});
});

app.get('/event/:category', function (req, res){
  db.User.findOne({_id: req.session.userId}, function (err, currentUser) {
    if (err){
        //console.log('database error: ', err);
        res.redirect('/eventcenter');
      } else {
        // console.log('loading profile of logged in user: ', currentUser);
        db.Event.find({category: req.params.category}, function (err, events){
          if (err) return console.error(err);
          console.log('err check');
          if (events) {
            res.render('events-index', {events: events, user: currentUser});
          }
        });
      }
    });
});

app.post('/events-date', function (req, res){
  console.log(req.body.event_date);
  db.Event.find({event_date: req.body.event_date}, function (err, found){
    console.log(err);
    // console.log(found);
    if (err) {
      console.log(err);
    }
    if (found) {
      console.log(found);
      // res.render('events-index', {events: found});
      res.json(found);
    }
  })
})
//user profile page
app.get('/profile', function (req, res){
  console.log(req.params);
  db.User.findOne({_id: req.session.userId}, function (err, currentUser) {
    if (err){
        console.log('database error: ', err);
      } else {
        db.Rsvp.find({user: currentUser}, function (err, rsvpList){
          if (err) {
            res.json(err);
          }
          //console.log(rsvp)
          var events = [];
          rsvpList.forEach(function (rsvp){
            console.log(rsvp.event);
            db.Event.findOne({_id: rsvp.event}, function (err, event){
              if (err) {
                res.json(err);
              }else{
                events.push(event);
                // console.log(event);
                if (events.length == 0 ){
                  res.render('profile', {user: currentUser})
                } else if(events.length == rsvpList.length) {
                  console.log("executing front");
                  res.render('profile', {user: currentUser, events: events})
                }
              }
            })
          });
        })
      }
    });
});

app.post('/organizationprofile', function (req, res){
  db.User.findOne({_id: req.session.userId}, function (err, currentUser) {
    console.log(req.session.userId);
    if (err) {
      console.log('user not exist:', err);
      res.redirect('/profile');
    }else{
      console.log(req.body);
      db.User.update({organization_name: req.body.organization_name, organizationUrl: req.body.organizationUrl, is_organzation: true}, function (err, updatedUser) {
        if (err) {
          console.log(err)
        }else{
          res.render('profile', {user: updatedUser})
        }
      })
    }
  })
})

app.post('/volunteerlprofile', function (req, res){
  db.User.findOne({_id: req.session.userId}, function (err, currentUser) {
    if (err) {
      console.log('user not exist:', err);
      res.redirect('/profile');
    }else{
      console.log(req.body);
      db.User.update({first_name: req.body.first_name, last_name: req.body.last_name, occupation: req.body.occupation}, function (err, updatedUser) {
        if (err) {
          console.log(err)
        }else{
          res.render('profile', {user: updatedUser})
        }
      })
    }
  })
})

app.post('/event/rsvp', function (req, res){
  // console.log("event id:", req.body)
  // console.log(req.session.userId)
  db.User.findOne({_id: req.session.userId}, function (err, currentUser) {
    if (err) {
      console.log(err);
    }else{
      db.Event.findOne({_id: req.body.event_id}, function (err, event){
        if (err) {
          console.log(err);
        }else{
          db.Rsvp.create({event: event, user: currentUser}, function (err){
            if (err) {
              console.log(err);
            }else{
              console.log("Rsvp Saved");
            }
          })
        }
      })
    }
  });
});

app.post('/event/unrsvp', function (req, res){
  // console.log("event id:", req.body)
  // console.log(req.session.userId)
  db.User.findOne({_id: req.session.userId}, function (err, currentUser) {
    if (err) {
      console.log(err);
    }else{
      db.Event.findOne({_id: req.body.event_id}, function (err, event){
        if (err) {
          console.log(err);
        }else{
          db.Rsvp.remove({event: event, user: currentUser}, function (err){
            if (err) {
              console.log(err);
            }else{
              console.log("Rsvp deleted");
            }
          })
        }
      })
    }
  });
});
app.listen(process.env.PORT || 3000);