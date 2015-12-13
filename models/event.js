var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user.js')
var Rsvp = require('./rsvp.js')

var EventSchema = new Schema({
	created_at : {type: Date },
	updated_at : {type: Date },
	event_date : {type: String},
	name: {type: String, require: true},
	location: {type: String, require: true},
	detail: {type: String, require: true},
	user: [{ type: Schema.ObjectId, ref: 'User' }],
	// user: [{type : User.Schema.Types.ObjectId}], // chats are associated with a specific user
	rsvps: [Rsvp.schema] // chats have a collection of messages
})

var Event = mongoose.model('Event', EventSchema);

module.exports = Event;