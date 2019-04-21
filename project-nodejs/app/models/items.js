const ItemsModel = require(__path_schemas + '/items');

module.exports = {
    listItems: (params, options = null) => {
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

    , getItem: (id, options = {}) => {
        return ItemsModel.findById(id);
    }

    , countItems: (params, options = null) => {
        return ItemsModel.countDocuments(params.objWhere);
    }

    , changeStatus: (id, currentStatus, options = {}) => {
        let status = (currentStatus === 'active') ? 'inactive' : 'active';
        let data = {
                status: status
                , modified: {
                    user_id: 0
                    , user_name: 'admin'
                    , time: Date.now()
                }
            };
    
        if(options.task === 'update-one'){
            return ItemsModel.updateOne({ _id: id }, data);
        }

        if(options.task === 'update-multi'){
            data.status = currentStatus;
            return ItemsModel.updateMany({ _id: { $in: id } }, data);
        }
    }

    , changeOrdering: async (cids, orderings, options = {}) => {
        let data = {
                ordering: parseInt(orderings)
                , modified:{
                    user_id: 0
                    , user_name: 'admin'
                    , time: Date.now()
                }
            };
    
        if (Array.isArray(cids)) { // Change ordering - Multi
            for(let index = 0; index < cids.length; index++){
                data.ordering = parseInt(orderings[index]);
                await ItemsModel.updateOne({ _id: cids[index]}, data);
            }
            return Promise.resolve('Succsess');
        } else { // Change ordering - One
            return ItemsModel.updateOne({ _id: cids }, data);
        }
    }

    , deleteItem: (id, options = {}) => {
        if(options.task === 'delete-one'){
            return ItemsModel.deleteOne({ _id: id });
        }

        if(options.task === 'delete-multi'){
            return ItemsModel.deleteMany({ _id: { $in: id } });
        }
    }
}