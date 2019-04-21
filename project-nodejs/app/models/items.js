const ItemsModel = require(__path_schemas + '/items');

module.exports = {
    listItems: (params) => {
        if (params.currentStatus !== 'all') params.objWhere.status = params.currentStatus;
        if (params.keyword !== '') params.objWhere.name = new RegExp(params.keyword, 'i');
        let sort		  = {};
        sort[params.sortField]   = params.sortType;

        return ItemsModel
            .find(params.objWhere)
            .select('name status ordering created modified')
            .sort(sort)
            .skip((params.pagination.currentPage - 1) * params.pagination.totalItemsPerPage)
            .limit(params.pagination.totalItemsPerPage);
    }
    , getItem: () => {
        
    }

    , countItems: (params) => {
        return ItemsModel.countDocuments(params.objWhere);
    }
}