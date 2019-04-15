let createFilterStatus = async (currentStatus, collection) => {
	const currentModel = require(__path_schemas + '/' + collection);
	let statusFilter = [
		{name: 'All', value: 'all', count: 1, class: 'default'},
		{name: 'Active', value: 'active', count: 2, class: 'default'},
		{name: 'Inactive', value: 'inactive', count: 3, class: 'default'}
	];

	for(let index = 0; index < statusFilter.length; index++){
		let item = statusFilter[index];
		let condition = (item.value !== 'all') ? {status: item.value} : {};
		
		if(item.value === currentStatus) statusFilter[index].class = 'success'
		await currentModel.countDocuments(condition).then((countItem) => {
			statusFilter[index].count = countItem;
		});
    }
    return statusFilter;
}

module.exports = {
    createFilterStatus
}