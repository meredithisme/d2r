var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user.js')
var Rsvp = require('./rsvp.js')

var EventSchema = new Schema({
	created: {type: Date, default: Date.now, required: true},
	updated: {type: Date, default: Date.now, required: true},
	event_date : {type: String},
	title: {type: String, require: true, trim: true, match: /^([\w ,.!?]{1,100})$/},
	detail: {type: String, require: true, trim: true, max:2000}, 
	url: {type: String, trim: true, max: 1000},
	location: {type: String},
	user: [{ type: Schema.ObjectId, ref: 'User' }],
	category: {type: String, require: true, trim: true},
	// author: { id: { type: Schema.ObjectId, ref: 'User', required: true},
	// 		  name: { type: String, required: true}},
	rsvps: [{ type: Schema.ObjectId, ref: 'User'}]
	// Rsvp.schema 
})

var Event = mongoose.model('Event', EventSchema);

module.exports = Event;