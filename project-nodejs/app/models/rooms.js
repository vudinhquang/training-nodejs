const RoomsModel 	= require(__path_schemas + '/rooms');
const FileHelpers = require(__path_helpers + '/file');
const uploadFolder = 'public/uploads/rooms/';

module.exports = {
    listItems: (params, options = null) => {
        let objWhere    = {};
        let sort		= {};
        if(params == null ){
            return RoomsModel
                .find()
                .select('name thumbnail status ordering created modified');
        }else{
            sort[params.sortField]  = params.sortType;
            if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
            if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
            return RoomsModel
                .find(objWhere)
                .select('name thumbnail status ordering created modified')
                .sort(sort)
                .skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
                .limit(params.pagination.totalItemsPerPage);
        }

    },

    listItemsForFrontend: (params, options = null) => {
        let objWhere    = {status: 'active'};
        let sort		= {ordering: 'asc'};

        return RoomsModel
                .find(objWhere)
                .select('name thumbnail')
                .sort(sort);
    },

    getItemForFrontend: (id, options = null) => {
        return RoomsModel.findById(id).select('name thumbnail');
    },

    getItem: (id, options = null) => {
        return RoomsModel.findById(id);
    },

    countItem: (params, options = null) => {
        let objWhere    = {};

        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

        return RoomsModel.countDocuments(objWhere);
    },

    changeStatus: (id, currentStatus, options = null) => {
        let status			= (currentStatus === "active") ? "inactive" : "active";
        let data 			= {
            status: status,
            modified: {
                user_id: 0,
                user_name: 0,
                time: Date.now()
            }
        }

        if(options.task == "update-one"){
            return RoomsModel.updateOne({_id: id}, data);
        }

        if(options.task == "update-multi"){
            data.status = currentStatus;
            return RoomsModel.updateMany({_id: {$in: id }}, data);
        }
    },

    changeOrdering: async (cids, orderings, options = null) => {
        let data = {
            ordering: parseInt(orderings),
            modified:{
                user_id: 0,
                user_name: 0,
                time: Date.now()
            }
        };

        if(Array.isArray(cids)) {
            for(let index = 0; index < cids.length; index++) {
                data.ordering = parseInt(orderings[index]);
                await RoomsModel.updateOne({_id: cids[index]}, data)
            }
            return Promise.resolve("Success");
        }else{
            return RoomsModel.updateOne({_id: cids}, data);
        }
    },

    deleteItem: async (id, options = null) => {
        if(options.task == "delete-one") {
            await RoomsModel.findById(id).then((item) => {
                FileHelpers.remove(uploadFolder, item.thumbnail);
            });
            return RoomsModel.deleteOne({_id: id});
        }
        if(options.task == "delete-mutli") {
            if(Array.isArray(id)){
                for(let index = 0; index < id.length; index++){
                    await RoomsModel.findById(id[index]).then((item) => {
                        FileHelpers.remove(uploadFolder, item.thumbnail);
                    });
                }
            }else{
                await RoomsModel.findById(id).then((item) => {
                    FileHelpers.remove(uploadFolder, item.thumbnail);
                });
            }
            return RoomsModel.remove({_id: {$in: id } });
        }
    },

    saveItem: (item, options = null) => {
        if(options.task == "add") {
            item.created = {
                user_id : 0,
                user_name: "admin",
                time: Date.now()
            }
            return new RoomsModel(item).save();
        }

        if(options.task == "edit") {
            return RoomsModel.updateOne({_id: item.id}, {
                ordering: parseInt(item.ordering),
                name: item.name,
                thumbnail: item.thumbnail,
                status: item.status,
                content: item.content,
                modified: {
                    user_id : 0,
                    user_name: 0,
                    time: Date.now()
                }
            });
        }
    }
}