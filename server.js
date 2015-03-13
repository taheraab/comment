'use strict';

var express = require('express');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var loginService = require('./services/login');
var app = express();

app.use(logger('combined'));
app.use(session({secret: 'Comment secret', resave: 'false', saveUninitialized: 'false'}));
app.use(bodyParser.json());
app.use(express.static('www'));

app.use('/loginservice', loginService);

//check session is valid
app.use(function(req, res, next) {
  next();
});

  
var server = app.listen(8080, function() {
  console.log('Test webserver listening at port: ' + server.address().port);
});