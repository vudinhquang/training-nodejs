var express = require('express');
var router = express.Router();

router.get('/list', function(req, res, next) {
  res.render('pages/items/list', { pageTitle: 'Item List Page' });
});

router.get('/add', function(req, res, next) {
  res.render('pages/items/add', { pageTitle: 'Item Add Page' });
});

module.exports = router;
