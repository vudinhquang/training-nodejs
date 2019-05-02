var express = require('express');
var router = express.Router();

router.use('/', require('./home'));
router.use('/category', require('./category'));
router.use('/about', require('./about'));
router.use('/contact', require('./contact'));
router.use('/post', require('./post'));

module.exports = router;
