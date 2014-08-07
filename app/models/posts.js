'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('Posts', {
	postName: String,
	postSlug: {type: String, index: {unique: true, dropDups: true }},
	postDate : Date,
	postAuthor : String,
	postBody: String,
	postMarkdown: String
});
