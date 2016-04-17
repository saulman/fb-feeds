/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /feeds              ->  index
 * POST    /feeds              ->  create
 * GET     /feeds/:id          ->  show
 * PUT     /feeds/:id          ->  update
 * DELETE  /feeds/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

function Feed(req){
  return req.app.get('models').Feed;
}

// Get list of feeds
exports.index = function(req, res) {
  new Feed(req)
    .findAll()
    .then(function (feeds) {
      return res.status(200).json(feeds);
    }) 
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });
};

// Get a single feed
exports.show = function(req, res) {
  new Feed(req)
    .findById(req.params.id)
    .then(function (feed) {
      if(!feed) { return res.status(404).send('Not Found'); }
      return res.json(feed);
    })
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });
};

// Creates a new feed in the DB.
exports.create = function(req, res) {
  new Feed(req)
    .create(req.body)
    .then(function(feed) {
      return res.status(201).json(feed);
    })
    .catch(function (err){
      if(err) { return handleError(res, err); }
    });
};

// Updates an existing feed in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  new Feed(req)
    .findById(req.params.id)
    .then(function (feed) {
      if(!feed) { return res.status(404).send('Not Found'); }
      var updated = _.merge(feed, req.body);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(feed);
      });
    })
    .catch(function (err){
      if (err) { return handleError(res, err); }
    });
};

// Deletes a fed from the DB.
exports.destroy = function(req, res) {
  new Feed(req)
    .findById(req.params.id)

    .then(function (feed) {
      if(!feed) { return res.status(404).send('Not Found'); }
      feed.destroy({
          where: {
            id: req.params.id
          }
        }).then(function(feed) {
          res.json(feed);
        })
      })
    .catch(function (err){
      if(err) { return handleError(res, err,req.params); }
    });
};

function handleError(res, err, params) {
  return res.status(500).send(err);
}
