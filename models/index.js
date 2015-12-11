var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/my_heroku_app");

// After creating a new model, require and export it:
// module.exports.Tweet = require("./tweet.js");
mongoose.connect( process.env.MONGOLAB_URI ||
                      process.env.MONGOHQ_URL || 
                      "mongodb://localhost/d2r_app" );

var User = require('./user.js');
var Event = require('./event.js');
var Rsvp = require('./rsvp.js');

module.exports.User = User;
module.exports.Event = Event;
module.exports.Rsvp = Rsvp;