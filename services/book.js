'use strict';

var express = require('express');
var router = express.Router();
var bookModel = require('../models/books');

/**
* Insert a new book
*/ 
router.post('/add', function(req, res, next) {
  bookModel.add(req.session.user.id, req.body, function(result) {
    res.send(result);
  });
});

/**
* Update existing book
*/ 
router.post('/update', function(req, res, next) {
  bookModel.update(req.session.user.id, req.body, function(result) {
    res.send(result);
  });
});

/**
* Get all books titles for this user
*/
router.get('/getAll', function(req, res, next) {
  bookModel.getAll(req.session.user.id, function(result) {
    res.send(result);
  });
});

/**
* Get book detail
*/
router.get('/get/:id', function(req, res, next) {
  bookModel.get(req.session.user.id, req.params.id, function(result) {
    res.send(result);
  });
});

/**
 * Add comment to a book
 */
 router.post('/addComment', function(req, res, next) {
   bookModel.addComment(req.session.user.id, req.body, function(result) {
     res.send(result);
   });  
 });
 
module.exports = router;