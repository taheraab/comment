'use strict';

var express = require('express');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var loginService = require('./services/login');
var bookService = require('./services/book');

var app = express();

app.use(logger('combined'));
app.use(session({secret: 'Comment secret', resave: 'false', saveUninitialized: 'false'}));
app.use(bodyParser.json());

mongoose.connect('mongodb://comment:comment@localhost:27017/commentDB', function(err) {
  if (err) console.log("Could not connect to database: " + err);
});

app.use(express.static('www'));
app.use('/loginservice', loginService);

//check session is valid
app.use(function(req, res, next) {
  if (typeof (req.session.user) != 'undefined') {
    next();
  }else {
    res.status(401).end();
  }
});

app.use('/bookservice', bookService);
  
var server = app.listen(process.env.PORT || 8080, function() {
  console.log('Test webserver listening at port: ' + server.address().port);
});