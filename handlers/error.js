'use strict';

function errorHandler(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.send('Not Found');
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
}

module.exports = errorHandler;
