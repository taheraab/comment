'use strict';

var express = require('express');
var app = express();

app.use(express.static('www'));

var server = app.listen(8080, function() {
  console.log('Test webserver listening at port: ' + server.address().port);
});