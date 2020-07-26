var express = require('express');
var router = express.Router();

const RoomsModel	= require(__path_models + '/rooms');

const folderView	= __path_views_chat + '/pages/list-room/';
const layoutChat    = __path_views_chat + '/main';

router.get('/', async (req, res, next) => {
    	let itemsRoom	= [];
		await RoomsModel.listItemsForFrontend(null, null).then( (rooms) => { itemsRoom = rooms; });
		res.render(`${folderView}index`, {
			layout: layoutChat,
            itemsRoom
		});
	});

module.exports = router;


