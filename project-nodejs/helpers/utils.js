const ItemsModel = require('../schemas/items');
let createFilterStatus = () => {
	let statusFilter = [
		{name: 'All', value: 'all', count: 1, link: '#', class: 'default'},
		{name: 'Active', value: 'active', count: 2, link: '#', class: 'success'},
		{name: 'Inactive', value: 'inactive', count: 3, link: '#', class: 'default'}
	];

	statusFilter.forEach((item, index) => {
		let condition = {};
		if(item.value !== 'all') condition = {status: item.value};
		ItemsModel.countDocuments(condition).then((countItem) => {
			statusFilter[index].count = countItem;
		});
    });
    return statusFilter;
}

module.exports = {
    createFilterStatus
}