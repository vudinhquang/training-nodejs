var express = require('express');
var router = express.Router();

const middleGetUserInfo         = require(__path_middleware + '/get-user-info');

router.use('/auth', require('./auth'));
router.use('/', middleGetUserInfo, require('./home'));

module.exports = router;