var mongoose = require('mongoose');

module.exports = mongoose.model('Pages', {
	pageName: String,
	pageSlug: {type: String, index: {unique: true, dropDups: true }},
	pageDate : Date,
	pageAuthor : String,
	pageBody: String
});