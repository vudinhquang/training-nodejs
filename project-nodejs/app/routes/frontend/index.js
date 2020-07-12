var express = require('express');
var router = express.Router();

const middleGetUserInfo         = require(__path_middleware + '/get-user-info');

router.use('/auth', require('./auth'));
router.use('/', middleGetUserInfo, require('./home'));
router.use('/category', require('./category'));
router.use('/about', require('./about'));
router.use('/contact', require('./contact'));
router.use('/post', require('./post'));
router.use('/article', require('./article'));

module.exports = router;
