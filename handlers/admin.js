'use strict';

function adminHandler(req, res){
  // Admin Page
  res.render('admin', { title: 'Success!', user: req.user });
}

module.exports = adminHandler;
