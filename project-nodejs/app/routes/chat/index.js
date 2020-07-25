var express = require('express');
var router = express.Router();

const middleGetUserInfo         = require(__path_middleware + '/get-user-info');
const middleAuthenticationChat  = require(__path_middleware + '/auth-chat');

module.exports = function(io) {
    router.use('/auth', require('./auth'));
    router.use('/', middleAuthenticationChat, middleGetUserInfo, require('./home')(io));
    router.use('/room', require('./room')(io));
    router.use('/invitation', require('./invitation'));
    router.use('/friends', require('./friends'));
    router.use('/api', require('./api'));
    
    return router;
}