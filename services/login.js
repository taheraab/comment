'use strict';

var express = require('express');
var router = express.Router();

router.post('/signin', function(req, res, next) {
  console.log(req.body);
  req.session.user = {id: req.body.userId};
  res.end();
});

module.exports = router;