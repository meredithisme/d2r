var mongoose = require('mongoose');

var RsvpSchema = mongoose.Schema({
	Body: String,
	// To: String, // this will be someone sending to / receiving from my Twilio number
	// From: String, // this will be my Twilio number
	// FromCity: String, 
	// FromState: String 
})


var Rsvp = mongoose.model('Rsvp', RsvpSchema);

module.exports = Rsvp;