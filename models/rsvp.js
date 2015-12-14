var mongoose = require('mongoose');

var RsvpSchema = mongoose.Schema({
	Body: String,
	// Once Rsvp is set up, may want to add email and text feature to the user
	// The Rsvp needs be fix
})


var Rsvp = mongoose.model('Rsvp', RsvpSchema);

module.exports = Rsvp;