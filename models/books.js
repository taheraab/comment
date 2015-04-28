'use strict'
/**
* Book Model 
* Performs add, remove and update of books and their associated comments
*/
var mongoose = require('mongoose');
var bookSchema = require('../schema/book.js');
var bookModel = mongoose.model('Book', bookSchema); 

/**
* Return books for a given user
*/
exports.getAll = function(userId, done) {
  bookModel.find({userId: userId})
  .sort('-createdAt')
  .exec(function(err, res) {
    if (err) {
      console.log(err);
      done([]);
    }
    done(res);
  });
};

/**
* Add a book for a given user
*/
exports.addBook = function(userId, book, done) {
  var book = new bookModel(book);
  book.userId = userId;
  book.save(function(err, res) {
    if (err) {
      console.log(err);
      done({result: false, msg: err});
    }
    done({result: true, msg: 'Inserted book: ' + book.title + ' successfully'});
  });
};