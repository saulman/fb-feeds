/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /users              ->  index
 * POST    /users              ->  create
 * GET     /users/:id          ->  show
 * PUT     /users/:id          ->  update
 * DELETE  /users/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

function User(req){
  return req.app.get('models').User;
}

// Get list of feeds
exports.index = function(req, res) {
  new User(req)
    .findAll()
    .then(function (users) {
      return res.status(200).json(users);
    })
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });
};

// Get a single feed
exports.show = function(req, res) {
   var username = req.params.username || '';
    var password = req.params.password || '';
 
    if (username === '' || password === '') {
        return res.send(401);
    }

  new User(req)
    .findOne({username: username})
    .then(function (user) {
      if(!user) { return res.status(404).send('Not Found'); }
      return res.json(user);
    })
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });
};

// Creates a new user in the DB.
exports.create = function(req, res) {
  new User(req)
    .create(req.body)
    .then(function(user) {
      return res.status(201).json(user);
    })
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });
};

// Updates an existing user in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  new User(req)
    .findById(req.params.id)
    .then(function (user) {
      if(!user) { return res.status(404).send('Not Found'); }
      var updated = _.merge(user, req.body);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(user);
      });
    })
    .catch(function (err){
      if (err) { return handleError(res, err); }
    });
};

// Deletes a fed from the DB.
exports.destroy = function(req, res) {
  new User(req)
    .findById(req.params.id)
    .then(function (user) {
      if(!user) { return res.status(404).send('Not Found'); }
      user.remove(function(err) {
        if(err) { return handleError(res, err); }
        return res.status(204).send('No Content');
      });
    })
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
