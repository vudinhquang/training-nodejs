var express = require('express');
var router = express.Router();

const ItemsModel = require('../../schemas/items');

router.get('/', (req, res, next) => {
	ItemsModel.find({}) .then((items) => {
		res.render('pages/items/list', { 
			pageTitle: 'Item List Page',
			items
		});
	});
});

router.get('/add', (req, res, next) => {
	res.render('pages/items/add', { pageTitle: 'Item Add Page' });
});

module.exports = router;
