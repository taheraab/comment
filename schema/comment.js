'use strict';
//Comment schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var states = ['read', 'unread', 'new'];
var commentSchema = new Schema({
  byUserId: String,
  createdAt: {type: Date, default: Date.now},
  content: String,
  status: {type: String, enum: states},
});

module.exports = commentSchema;