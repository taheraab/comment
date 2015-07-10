'use strict';
//Comment schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  userId: {type:String, required:"User ID not present"},
  username: String,
  userImageUrl: String,
  createdAt: {type: Date, default: Date.now},
  content: String
});

module.exports = commentSchema;