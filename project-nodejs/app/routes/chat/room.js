var express = require('express');
var router = express.Router();

const RoomsModel	= require(__path_models + '/rooms');

var moment = require('moment');
const ParamsHelpers = require(__path_helpers + '/params');
const folderView	= __path_views_chat + '/pages/room/';
const layoutChat    = __path_views_chat + '/main';
var UsersRoom		= require(__path_helpers + '/users-room');

module.exports = function(io) {
	let prefixSocket = "ROOM_";

	router.get('/:room', async (req, res, next) => {
		let roomID 		= ParamsHelpers.getParam(req.params, 'room', '');
		let roomItem    = [];

		await RoomsModel.getItemForFrontend(roomID).then((item) => { roomItem = item; });
		res.render(`${folderView}index`, {
			layout: layoutChat,
			roomID,
			roomItem,
			prefixSocket
		});
	});

	var usersRoom = new UsersRoom();
	io.on('connection', function(socket){
		socket.on(`${prefixSocket}CLIENT_SEND_JOIN_ROOM`, (data) => {
			socket.join(data.room);
			usersRoom.addUser(socket.id, data.username, data.avatar, data.room);
			io.to(data.room).emit(`${prefixSocket}SEND_LIST_USER`, usersRoom.getListUsers(data.room));
		});

        socket.on(`${prefixSocket}CLIENT_SEND_TYPING`, async (data) => {
			socket.to(data.room).emit(`${prefixSocket}SEND_USER_TYPING`, { username : data.username, showTyping: data.showTyping });
        });

		socket.on('disconnect', () => {
			let user = usersRoom.removeUser(socket.id);
			if(user) {
				io.to(user.room).emit(`${prefixSocket}SEND_LIST_USER`, usersRoom.getListUsers(user.room));
			}
		});
	});

    return router;
}
