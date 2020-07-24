var express = require('express');
var router = express.Router();

const UsersModel 	= require(__path_models + '/users');

router.post('/add-friend', async (req, res, next) => {
	let item		    = {};
	item.fromUsername 	= req.body.fromUsername;
	item.fromAvatar 	= req.body.fromAvatar;
    item.toUsername 	= req.body.toUsername;
    item.toAvatar 		= req.body.toAvatar;
    
    await UsersModel.saveItem(item, {task: "request-add-friend"});
    await UsersModel.saveItem(item, {task: "receive-add-friend"});

	res.json(item);
});

module.exports = router;
