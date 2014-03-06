var BlogPage = require('../models/pages');

module.exports = function(req, res){
	// Pulls a page based on the slug

	BlogPage.findOne({ pageSlug: req.params.pageSlug}, function(err, thePage){
		if(!thePage){
			console.log('the error' + err);
			res.send('Not found');
		}else{
			var pageData = {
				title: thePage.pageName, 
				body: thePage.pageBody, 
				slug: req.params.pageSlug, 
				user: req.user
			};

			res.render('page', pageData);
		}
	});
};