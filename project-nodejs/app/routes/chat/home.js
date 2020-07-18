var express = require('express');
var router = express.Router();

const ChatsModel	 = require(__path_models + '/chats');
const folderView	 = __path_views_chat + '/pages/home';
const layoutChat	 = __path_views_chat + '/main';

module.exports = function(io) {
	/* GET home page. */
	router.get('/', async (req, res, next) => {
        let itemsChat	= [];

        await ChatsModel.listItems(null, null).then( (items) => { itemsChat = items; });
		res.render(`${folderView}/index`, {
            layout: layoutChat,
            itemsChat
		});
	});

    // socket.io events
    io.on( "connection", function ( socket ) {
        socket.emit('SERVER_SEND_SOCKETID', socket.id);

        socket.on('CLIENT_SEND_ALL_MESSAGE', async (data) => {
            await ChatsModel.saveItem(data, {task: "add"}).then((result) => {
                io.emit('SERVER_RETURN_ALL_MESSAGE', result);
            });
        });
    });
    
    return router;
}
