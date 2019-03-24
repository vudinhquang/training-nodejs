var express = require('express');
var router = express.Router();

const ItemsModel = require('../../schemas/items');

router.get('/', (req, res, next) => {
	let statusFilter = [
		{name: 'All', count: 1, link: '#', class: 'default'},
		{name: 'Active', count: 2, link: '#', class: 'success'},
		{name: 'Inactive', count: 3, link: '#', class: 'default'}
	];
	ItemsModel.find({}) .then((items) => {
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