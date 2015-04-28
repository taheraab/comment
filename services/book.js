'use strict';

var express = require('express');
var router = express.Router();
var bookModel = require('../models/book');

/**
* Insert a new book
*/ 
router.post('/addBook', function(req, res, next) {
  console.log(req.body);
  bookModel.addBook(req.session.user.id, req.body, function(result) {
    res.send(result);
  });
});

/**
* Get all books for this user
*/
router.get('/getAll', function(req, res, next) {
  bookModel.getAll(req.session.user.id, function(result) {
    res.send(result);
  });
});

module.exports = router;