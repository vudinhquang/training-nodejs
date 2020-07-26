const ChatsModel 	= require(__path_schemas + '/chats');
// const databaseConfig = require(__path_configs + '/database');

module.exports = {
    listItems: (params, options = null) => {
        let objWhere    = {};
        let sort		= {'created' : 'asc'};
        /*
        return ChatsModel.aggregate([
            { 
                $lookup: {
                    from: databaseConfig.col_users,
                    localField: 'username',
                    foreignField: 'username',
                    as: 'myResult'
                }
            },
            { 
                $project: { 
                    "username" : 1 , 
                    "myResult.avatar" : 1, 
                    "content": 1,
                    "created": 1,
                }
            }
        ]);
        */
        return ChatsModel.find(objWhere)
            //.populate('user', 'avatar username')
            .select('content created avatar username')
            .sort(sort);
    },

    getItem: (id, options = null) => {
        return ChatsModel.findById(id);
    },

    countItem: (params, options = null) => {
        let objWhere    = {};
        return ChatsModel.countDocuments(objWhere);
    },

    deleteItem: (id, options = null) => {
        if(options.task == "delete-one") {
            return ChatsModel.deleteOne({_id: id});
        }

        if(options.task == "delete-mutli") {
            return ChatsModel.remove({_id: {$in: id } });
        }
    },

    saveItem: (item, options = null) => {
        if(options.task == "add") {
            item.created = Date.now()
			return new ChatsModel(item).save();
        }
    }
}