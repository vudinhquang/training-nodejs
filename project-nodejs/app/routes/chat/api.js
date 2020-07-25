var express = require('express');
var router = express.Router();

const systemConfig  = require(__path_configs + '/system');
const ParamsHelpers = require(__path_helpers + '/params');
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

router.post('/add-friend-deny', async (req, res, next) => {
    let item            = {}
    let userId          = ParamsHelpers.getParam(req.session, systemConfig.sess_login, '');
    let user            = await UsersModel.getItem(userId);	
    item.senderName     = req.body.senderName;
    item.receiverName   = user.username;

    await UsersModel.saveItem(item, {task: "add-friend-deny-receiver"});
    await UsersModel.saveItem(item, {task: "add-friend-deny-sender"});
    
    res.json(item);
});

router.post('/add-friend-accept', async (req, res, next) => {
    let item            = {}
    let userId          = ParamsHelpers.getParam(req.session, systemConfig.sess_login, '');
    let user            = await UsersModel.getItem(userId);	

    item.senderName     = req.body.senderName;
    item.receiverName   = user.username;
    
    await UsersModel.saveItem(item, {task: "add-friend-accept-receiver"});
    await UsersModel.saveItem(item, {task: "add-friend-accept-sender"});
    res.json(item);
});

module.exports = router;
