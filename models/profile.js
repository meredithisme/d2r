var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user.js');
var Rsvp = require('./rsvp.js');
var Event = require('./event.js');

var ProfileSchema = new Schema({
	occupation: {type: String, required: true, trim: true},
	organization_name: {type: String, required: true, trim: true},
	is_organzation: {type: Boolean, default: false},
	organizationUrl: {type: String, required: true, trim: true},
	first_name: {type: String, required: true, trim: true},
	last_name: {type: String, required: true, trim: true},
	is_organzation: {type: Boolean, default: false},
	photoUrl: String 

	// Rsvp.schema 
})

var Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;