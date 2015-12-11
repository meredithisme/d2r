var mongoose= require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	email: {type:String, required: true},
	passwordDigest: { type: String, required: true, select: false },
	first_name: String,
	last_name: String,
	events: [{type: Schema.Types.ObjectId, ref: 'Events'}],
	RSVP: Array
});


/*======================================================================*/


UserSchema.statics.createSecure = function (email, password, callback) {
	var user = this;

	bcrypt.genSalt(function (err, salt) {
		bcrypt.hash(password, salt, function (err, hash) {
			console.log(hash);
			user.create({
				email: email,
				passwordDigest: hash
			}, callback);
		});
	});
 };

/*======================================================================*/


UserSchema.statics.authenticate = function (email, password, callback) {
	this.findOne({email: email}, 'email passwordDigest', function(err, foundUser) {
		console.log('found user:',foundUser);
		console.log(password);
		if(!foundUser) {
			console.log("no user lives here" + email);
			callback("Error: no user found", null);
		} else if (foundUser.checkPassword(password)) {
			callback(null, foundUser);
		} else {
			callback("error: incorrect password", null);
		}
	});
};

/*======================================================================*/

UserSchema.methods.checkPassword = function(password) {
	console.log('this', this);
	return bcrypt.compareSync(password, this.passwordDigest);
};

var User = mongoose.model('User', UserSchema);
module.exports= User;