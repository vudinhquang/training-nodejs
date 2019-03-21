var express = require('express');
var router = express.Router();

router.get('/list', function(req, res, next) {
  res.render('items/list', { title: 'Item List Page' });
});

router.get('/add', function(req, res, next) {
  res.render('items/add', { title: 'Item Add Page' });
});

module.exports = router;
