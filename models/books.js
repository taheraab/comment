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
  .sort('-updatedAt')
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
  bookModel.findById(id)
  .where('userId', userId)
  .exec(function(err, res) {
    if (err) {
      console.log(err);
      done({});
    }
    done(res);
  });
};

/**
* Add a book for a given user
*/
exports.add = function(userId, bookObj, done) {
  var book = new bookModel({
    id: bookObj.id,
    title: bookObj.title,
    description: bookObj.description,
    rating: bookObj.rating,
    publishedBy: bookObj.publishedBy,
    publishedDate: bookObj.publishedDate,
    authors: bookObj.authors,
    thumbnailLink: bookObj.thumbnailLink,
    contentLink: bookObj.contentLink,
    categories: bookObj.categories,
    pageCount: bookObj.pageCount,
    comments: bookObj.comments,
    userId: userId,
    sharedWith: bookObj.sharedWith  
  });
  book.save(function(err) {
    if (err) {
      console.log(err);
      done({result: false, msg: err});
    }
    done({result: true, book: book, msg: 'Inserted book: ' + book.title + ' successfully'});
  });
};

/**
 * Update book title
 */
 exports.update = function(userId, bookObj, done) {
  bookModel.findById(bookObj.id)
  .where('userId', userId)
  .exec(function(err, book) {
    if (err) {
      console.log(err);
      done({result: false, msg:err});
    }
    book.title = bookObj.title;
    book.updatedAt = Date.now();
    book.save(function(err) {
      if (err) {
        console.log(err);
        done({result: false, msg: err});
      }
      done({result: true, book: {updatedAt:book.updatedAt, title: book.title}, msg: 'Updated book: ' + book.title + ' successfully'});    
    });
  }); 
 }
 
 /**
  * Add comment to a book
  */
  exports.addComment = function(userId, obj, done) {
    bookModel.findById(obj.bookId)
    .where('userId', userId)
    .exec(function(err, book) {
      if (err) {
        console.log(err);
        done({result: false, msg:err});
      }
      book.comments.unshift({
        userId: obj.comment.userId,
        username: obj.comment.username,
        userImageUrl: obj.comment.userImageUrl,
        content: obj.comment.content
      });
      book.updatedAt = Date.now();
      book.save(function(err) {
        if (err) {
          console.log(err);
          done({result: false, msg: err});
        }
        done({result: true, book: {updatedAt: book.updatedAt, comment: book.comments[0]}, msg: 'Updated book: ' + book.title + ' successfully'});    
      });     
    });
  }