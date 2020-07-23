var express = require('express');
var router = express.Router();

var moment = require('moment');

const ChatsModel	 = require(__path_models + '/chats');
const RoomsModel	= require(__path_models + '/rooms');
var UsersServer		= require(__path_helpers + '/users-server');
const folderView	 = __path_views_chat + '/pages/home';
const layoutChat	 = __path_views_chat + '/main';
const systemConfig 	= require(__path_configs + '/system');
const notify  		= require(__path_configs + '/notify');

module.exports = function(io) {
    let users = new UsersServer();
	/* GET home page. */
	router.get('/', async (req, res, next) => {
        let itemsChat	= [];
        let itemsRoom	= [];

        await RoomsModel.listItemsForFrontend(null, null).then( (rooms) => { itemsRoom = rooms; });
        await ChatsModel.listItems(null, null).then( (items) => { itemsChat = items; });
		res.render(`${folderView}/index`, {
            layout: layoutChat,
            itemsChat,
            itemsRoom
		});
	});

    // socket.io events
    io.on( "connection", function ( socket ) {
        socket.emit('SERVER_SEND_SOCKETID', socket.id);

        socket.on('CLIENT_SEND_ALL_MESSAGE', async (data) => {
			if(data.content.length > 5) {
                await ChatsModel.saveItem(data, {task: "add"}).then((result) => {
                    io.emit('SERVER_RETURN_ALL_MESSAGE', {
                        content: result.content,
                        username: result.username,
                        avatar: result.avatar,
                        created: moment(result.created).format(systemConfig.format_time_chat)
                    });
                });
			}else {
				socket.emit('SERVER_RETURN_ERROR', {
					type: 'error',
					content:  notify.ERROR_MSG_CHAT_TOO_SHORT
				});
			}
        });

        socket.on('CLIENT_SEND_TYPING', async (data) => {
			socket.broadcast.emit('SERVER_SEND_USER_TYPING', { username : data.username, showTyping: data.showTyping });
        });

        socket.on('USER_CONNECT', async (data) => {
            users.addUser(socket.id, data.username, data.avatar);
			io.emit('SERVER_SEND_ALL_LIST_USER', users.getListUsers());
        });
        
		socket.on('disconnect', () => {
			let user = users.removeUser(socket.id);
			if(user) {
				io.emit('SERVER_SEND_ALL_LIST_USER',users.getListUsers());
			}
		});
    });
    
    return router;
}
