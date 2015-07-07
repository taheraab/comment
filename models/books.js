'use strict'
/**
* Book Model 
* Performs add, remove and update of books and their associated comments
*/
var mongoose = require('mongoose');
var bookSchema = require('../schema/book.js');
var bookModel = mongoose.model('Book', bookSchema); 

/**
* Return book titles for a given user
*/
exports.getAll = function(userId, done) {
  bookModel.find({userId: userId})
  .sort('-createdAt')
  .select('_id title')
  .exec(function(err, res) {
    if (err) {
      console.log(err);
      done([]);
    }
    done(res);
  });
};

/**
* Return complete book record for given id
*/
exports.get = function(userId, id, done) {
  bookModel.find({userId: userId})
  .where('_id').equals(id)
  .exec(function(err, res) {
    if (err) {
      console.log(err);
      done({});
    }
    done(res[0]);
  });
};

/**
* Add a book for a given user
*/
exports.add = function(userId, book, done) {
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

/**
 * Update book title
 */
 exports.update = function(userId, book, done) {
   
 }