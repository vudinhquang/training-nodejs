var express = require('express');
var router = express.Router();

const ItemsModel = require('../../schemas/items');
const UtilsHelpers = require('../../helpers/utils');

router.get('/', (req, res, next) => {
	let statusFilter = UtilsHelpers.createFilterStatus();

	ItemsModel.find({}).then((items) => {
		res.render('pages/items/list', { 
			pageTitle: 'Item List Page',
			items,
			statusFilter
		});
	});
});

router.get('/add', (req, res, next) => {
	res.render('pages/items/add', { pageTitle: 'Item Add Page' });
});

module.exports = router;