var mongoose = require('mongoose');

module.exports = mongoose.model('Users', {
	userName: String,
	userEmail : String,
	password: String
});