var mongoose = require('mongoose');

module.exports = mongoose.model('Pages', {
	pageName: String,
	pageDate : Date,
	pageAuthor : String,
	pageBody: String
});