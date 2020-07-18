var express = require('express');
var router = express.Router();

const middleGetUserInfo         = require(__path_middleware + '/get-user-info');
const middleAuthenticationChat  = require(__path_middleware + '/auth-chat');

module.exports = function(io) {
    router.use('/auth', require('./auth'));
    router.use('/', middleAuthenticationChat, middleGetUserInfo, require('./home'));

    // socket.io events
    io.on( "connection", function( socket ) {
        socket.emit('SERVER_SEND_SOCKETID', socket.id);
        console.log( "A user connected" );
    });
    return router;
}