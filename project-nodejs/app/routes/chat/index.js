var express = require('express');
var router = express.Router();

const middleGetUserInfo         = require(__path_middleware + '/get-user-info');
const middleAuthenticationChat  = require(__path_middleware + '/auth-chat');

router.use('/auth', require('./auth'));
router.use('/', middleAuthenticationChat, middleGetUserInfo, require('./home'));

module.exports = router;