var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HomePage' });
});

/* GET dashboard page. */
router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard Page' });
});

module.exports = router;
