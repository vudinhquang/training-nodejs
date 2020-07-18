var express = require('express');
var router = express.Router();

const folderView	 = __path_views_chat + '/pages/home/';
const layoutChat	 = __path_views_chat + '/main';

module.exports = function(io) {
	/* GET home page. */
	router.get('/', function(req, res, next) {
		res.render(`${folderView}index`, {
			layout: layoutChat
		});
	});

    // socket.io events
    io.on( "connection", function( socket ) {
        socket.emit('SERVER_SEND_SOCKETID', socket.id);

        socket.on('CLIENT_SEND_ALL_MESSAGE', (data) => {
            console.log(data);
        });
    });
    
    return router;
}
