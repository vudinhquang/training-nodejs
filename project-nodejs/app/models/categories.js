const CategoriesModel = require(__path_schemas + '/category');
const StringHelpers   = require(__path_helpers + '/string');

module.exports = {
    listItems: (params, options = {}) => {
        let objWhere = {};
        if (params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if (params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        let sort		  = {};
        sort[params.sortField]   = params.sortType;

        return  CategoriesModel
            .find(objWhere)
            .select('name status ordering created modified slug')
            .sort(sort)
            .skip((params.pagination.currentPage - 1) * params.pagination.totalItemsPerPage)
            .limit(params.pagination.totalItemsPerPage);
    }

    , listItemsInSelectbox: (params, options = {}) => {
        return CategoriesModel.find({},{_id:1, name:1});
    }

    , getItem: (id, options = {}) => {
        return CategoriesModel.findById(id);
    }

    , countItems: (params, options = {}) => {
        let objWhere = {};

        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        
        return CategoriesModel.countDocuments(objWhere);
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
            return CategoriesModel.updateOne({ _id: id }, data);
        }

        if(options.task === 'update-multi'){
            data.status = currentStatus;
            return CategoriesModel.updateMany({ _id: { $in: id } }, data);
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
                await CategoriesModel.updateOne({ _id: cids[index]}, data);
            }
            return Promise.resolve('Succsess');
        } else { // Change ordering - One
            return CategoriesModel.updateOne({ _id: cids }, data);
        }
    }

    , deleteItem: (id, options = {}) => {
        if(options.task === 'delete-one'){
            return CategoriesModel.deleteOne({ _id: id });
        }

        if(options.task === 'delete-multi'){
            return CategoriesModel.deleteMany({ _id: { $in: id } });
        }
    }

    , saveItem: (item, options = {}) => {
        if(options.task === 'add'){
			item.created = {
				user_id: 0
				, user_name: 'admin'
				, time: Date.now()
            };
            item.slug = StringHelpers.createAlias(item.slug);
			return new CategoriesModel(item).save();
        }

        if(options.task === 'edit'){
			return CategoriesModel.updateOne({ _id: item.id }, {
                        name: item.name
                        , ordering: parseInt(item.ordering)
                        , status: item.status
                        , content: item.content
                        , slug   : StringHelpers.createAlias(item.slug)
                        , modified:{
                            user_id: 0
                            , user_name: 'admin'
                            , time: Date.now()
                        }
                    });
        }
    }
}