'use strict';
//Book schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = require('./comment.js');

var bookSchema = new Schema({
  id: {type: String, required: 'Id not present'},
  title: String,
  description: String,
  rating: [String],
  publishedBy: String,
  publishedDate: String,
  authors: String,
  thumbnailLink: String,
  contentLink: String,
  categories: String,
  pageCount: String,
  comments: [commentSchema],
  createdAt: {type: Date, default: new Date()},
  updatedAt: {type: Date, default: new Date()},
  userId: {type: String, required: 'UserId not present'},
  sharedWith: [String]
});

module.exports = bookSchema;