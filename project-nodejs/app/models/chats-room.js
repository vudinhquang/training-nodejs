const ChatsRomModel 	= require(__path_schemas + '/chats-room');

module.exports = {
    listItems: (params, options = null) => {
        if(options.task == "list-items-by-room"){
            let objWhere    = {room: params.room};
            let sort		= {'created' : 'asc'};
            return ChatsRomModel
                .find(objWhere)
                .select('content created username avatar')
                .sort(sort);
        }
    },

    countItem: (params, options = null) => {
        let objWhere    = {};
        return ChatsRomModel.countDocuments(objWhere);
    },

    saveItem: (item, options = null) => {
        if(options.task == "add") {
            item.created = Date.now()
			return new ChatsRomModel(item).save();
        }
    }
}