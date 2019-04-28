const UsersModel = require(__path_schemas + '/users');
const fs = require('fs');

module.exports = {
    listItems: (params, options = {}) => {
        let objWhere = {};
        if (params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if (params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        let sort		  = {};
        sort[params.sortField]   = params.sortType;

        if(params.groupID !== 'novalue') objWhere['group.id'] = params.groupID; 
	    if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

        return UsersModel
            .find(objWhere)
            .select('name avatar status ordering created modified group.name')
            .sort(sort)
            .skip((params.pagination.currentPage - 1) * params.pagination.totalItemsPerPage)
            .limit(params.pagination.totalItemsPerPage);
    }

    , getItem: (id, options = {}) => {
        return UsersModel.findById(id);
    }

    , countItems: (params, options = {}) => {
        let objWhere = {};
        if (params.groupID !== 'novalue') objWhere['group.id'] = params.groupID;
        if (params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if (params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

        return UsersModel.countDocuments(objWhere);
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
            return UsersModel.updateOne({ _id: id }, data);
        }

        if(options.task === 'update-multi'){
            data.status = currentStatus;
            return UsersModel.updateMany({ _id: { $in: id } }, data);
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
                await UsersModel.updateOne({ _id: cids[index]}, data);
            }
            return Promise.resolve('Succsess');
        } else { // Change ordering - One
            return UsersModel.updateOne({ _id: cids }, data);
        }
    }

    , deleteItem: async (id, options = {}) => {
        if(options.task === 'delete-one'){
            await UsersModel.findById(id).then((item) => {
                fs.exists('public/uploads/users/' + item.avatar, (exists) => {
                    if (exists) {
                        if(item.avatar !== 'no-avatar'){
                            fs.unlink('public/uploads/users/' + item.avatar, (err) => {
                                if (err) throw err;
                            });
                        }
                    }
                });
            });

            return UsersModel.deleteOne({ _id: id });
        }

        if(options.task === 'delete-multi'){
            return UsersModel.deleteMany({ _id: { $in: id } });
        }
    }

    , saveItem: (item, options = {}) => {
        if(options.task === 'add'){
			item.created = {
				user_id: 0
				, user_name: 'admin'
				, time: Date.now()
            };
			item.group = {
				id: item.group_id,
				name: item.group_name,
			}
			return new UsersModel(item).save();
        }

        if(options.task === 'edit'){
			return UsersModel.updateOne({ _id: item.id }, {
                        name: item.name
                        , ordering: parseInt(item.ordering)
                        , status: item.status
                        , content: item.content
                        , group: {
                            id: item.group_id,
                            name: item.group_name,
                        }
                        , modified:{
                            user_id: 0
                            , user_name: 'admin'
                            , time: Date.now()
                        }
                    });
        }

        if(options.task === 'change-group-name'){
			return UsersModel.updateMany({ 'group.id': item.id }, {
                        group: {
                            id: item.id,
                            name: item.name
                        }
                    });
        }
    }
}