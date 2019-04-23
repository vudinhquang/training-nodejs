const GroupsModel = require(__path_schemas + '/groups');

module.exports = {
    listItems: (params, options = null) => {
        let objWhere = {};
        if (params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if (params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        let sort		  = {};
        sort[params.sortField]   = params.sortType;

        return GroupsModel
            .find(objWhere)
            .select('name status ordering created modified group_acp')
            .sort(sort)
            .skip((params.pagination.currentPage - 1) * params.pagination.totalItemsPerPage)
            .limit(params.pagination.totalItemsPerPage);
    }

    , getItem: (id, options = {}) => {
        return GroupsModel.findById(id);
    }

    , countItems: (params, options = null) => {
        let objWhere = {};
        return GroupsModel.countDocuments(objWhere);
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
            return GroupsModel.updateOne({ _id: id }, data);
        }

        if(options.task === 'update-multi'){
            data.status = currentStatus;
            return GroupsModel.updateMany({ _id: { $in: id } }, data);
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
                await GroupsModel.updateOne({ _id: cids[index]}, data);
            }
            return Promise.resolve('Succsess');
        } else { // Change ordering - One
            return GroupsModel.updateOne({ _id: cids }, data);
        }
    }

    , deleteItem: (id, options = {}) => {
        if(options.task === 'delete-one'){
            return GroupsModel.deleteOne({ _id: id });
        }

        if(options.task === 'delete-multi'){
            return GroupsModel.deleteMany({ _id: { $in: id } });
        }
    }

    , saveItem: (item, options = {}) => {
        if(options.task === 'add'){
			item.created = {
				user_id: 0
				, user_name: 'admin'
				, time: Date.now()
			};
			return new GroupsModel(item).save();
        }

        if(options.task === 'edit'){
			return GroupsModel.updateOne({ _id: item.id }, {
                        name: item.name
                        , ordering: parseInt(item.ordering)
                        , status: item.status
                        , content: item.content
                        , modified:{
                            user_id: 0
                            , user_name: 'admin'
                            , time: Date.now()
                        }
                    });
        }
    }

    , changeGroupACP: (currentGroupACP, id, options = {}) => {
        let groupACP 	= (currentGroupACP === 'yes') ? 'no' : 'yes';
        let data 		= {
                            group_acp: groupACP
                            , modified: {
                                user_id: 0
                                , user_name: 'admin'
                                , time: Date.now()
                            }
                        };
        return GroupsModel.updateOne({ _id: id }, data);
    }
}