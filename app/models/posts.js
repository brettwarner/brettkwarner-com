var mongoose = require('mongoose');

module.exports = mongoose.model('Posts', {
	postName: String,
	postDate : Date,
	postAuthor : String,
	postBody: String
});