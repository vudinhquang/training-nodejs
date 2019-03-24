var express = require('express');
var router = express.Router();

const ItemsModel = require('../../schemas/items');

router.get('/', (req, res, next) => {
	let statusFilter = [
		{name: 'All', value: 'all', count: 1, link: '#', class: 'default'},
		{name: 'Active', value: 'active', count: 2, link: '#', class: 'success'},
		{name: 'Inactive', value: 'inactive', count: 3, link: '#', class: 'default'}
	];

	statusFilter.forEach((item, index) => {
		let condition = {};
		if(item.value !== 'all') condition = {status: item.value};
		ItemsModel.count(condition).then((countItem) => {
			statusFilter[index].count = countItem;
		});
	});

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