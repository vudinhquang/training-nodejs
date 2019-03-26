var express = require('express');
var router = express.Router();

const ItemsModel = require('../../schemas/items');
const UtilsHelpers = require('../../helpers/utils');
const ParamsHelpers = require('../../helpers/params');

// List items
router.get('(/:status)?', (req, res, next) => {
	let objWhere 	  = {};
	let keyword		  = ParamsHelpers.getParam(req.query, 'keyword', '');
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'all');
	let statusFilter  = UtilsHelpers.createFilterStatus(currentStatus);

	if (currentStatus !== 'all') objWhere = {status: currentStatus};

	ItemsModel.find(objWhere).then((items) => {
		res.render('pages/items/list', { 
			pageTitle: 'Item List Page',
			items,
			statusFilter,
			currentStatus
		});
	});
});

router.get('/add', (req, res, next) => {
	res.render('pages/items/add', { pageTitle: 'Item Add Page' });
});

module.exports = router;