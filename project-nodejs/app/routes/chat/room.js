var express = require('express');
var router = express.Router();

const RoomsModel	= require(__path_models + '/rooms');

const ParamsHelpers = require(__path_helpers + '/params');
const folderView	= __path_views_chat + '/pages/room/';
const layoutChat    = __path_views_chat + '/main';

module.exports = function(io) {

	router.get('/:room', async (req, res, next) => {
		let roomID 		= ParamsHelpers.getParam(req.params, 'room', '');
		let roomItem    = [];

		await RoomsModel.getItemForFrontend(roomID).then((item) => { roomItem = item; });
		res.render(`${folderView}index`, {
			layout: layoutChat,
			roomID,
			roomItem
		});
	});

    return router;
}

