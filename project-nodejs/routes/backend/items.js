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

	if (currentStatus !== 'all') {
		if (keyword == '') {
			objWhere = {status: currentStatus};
		} else {
			objWhere = {status: currentStatus, name: new RegExp(keyword, 'i')};
		}
	} else {
		if (keyword !== '') {
			objWhere = {name: new RegExp(keyword, 'i')};
		}
	}

	ItemsModel
		.find(objWhere)
		.sort({ordering: 'desc'})
		.then((items) => {
		res.render('pages/items/list', { 
			pageTitle: 'Item List Page',
			items,
			statusFilter,
			currentStatus,
			keyword
		});
	});
});

router.get('/add', (req, res, next) => {
	res.render('pages/items/add', { pageTitle: 'Item Add Page' });
});

module.exports = router;