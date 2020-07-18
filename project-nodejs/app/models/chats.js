const ChatsModel 	= require(__path_schemas + '/chats');

module.exports = {
    listItems: (params, options = null) => {
        let objWhere    = {};
        let sort		= {'created' : 'asc'};

        return ChatsModel.find(objWhere)
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