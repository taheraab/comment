'use strict';

var express = require('express');
var router = express.Router();

router.post('/signin', function(req, res, next) {
  console.log(req.body);
  next();
});

module.exports = router;