var mongoose = require('mongoose');
var Event = require('./event.js');
var User = require('./user.js');
var Schema = mongoose.Schema;

var RsvpSchema = new Schema({
	event: [{ type: Schema.ObjectId, ref: 'Event' }],
	user: [{ type: Schema.ObjectId, ref: 'User' }]
})


var Rsvp = mongoose.model('Rsvp', RsvpSchema);

module.exports = Rsvp;