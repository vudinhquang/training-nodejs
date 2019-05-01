const ArticlesModel = require(__path_schemas + '/article');
const FileHelpers = require(__path_helpers + '/file');
const uploadFolder = 'public/uploads/article/';

module.exports = {
    listItems: (params, options = {}) => {
        let objWhere = {};
        if (params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if (params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        let sort = {};
        sort[params.sortField] = params.sortType;

        if (params.categoryID !== 'allvalue') objWhere['category.id'] = params.categoryID;
        if (params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if (params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

        return ArticlesModel
            .find(objWhere)
            .select('name thumb status special ordering created modified category.name')
            .sort(sort)
            .skip((params.pagination.currentPage - 1) * params.pagination.totalItemsPerPage)
            .limit(params.pagination.totalItemsPerPage);
    }

    , getItem: (id, options = {}) => {
        return ArticlesModel.findById(id);
    }

    , countItems: (params, options = {}) => {
        let objWhere = {};
        if (params.categoryID !== 'allvalue') objWhere['category.id'] = params.categoryID;
        if (params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if (params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

        return ArticlesModel.countDocuments(objWhere);
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

        if (options.task === 'update-one') {
            return ArticlesModel.updateOne({ _id: id }, data);
        }

        if (options.task === 'update-multi') {
            data.status = currentStatus;
            return ArticlesModel.updateMany({ _id: { $in: id } }, data);
        }
    }

    , changeSpecial: (id, currentSpecial, options = null) => {
        let special = (currentSpecial === "active") ? "inactive" : "active";
        let data = {
            special: special,
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now()
            }
        }

        if (options.task == "update-one") {
            return ArticlesModel.updateOne({ _id: id }, data);
        }

        if (options.task == "update-multi") {
            data.special = currentSpecial;
            return ArticlesModel.updateMany({ _id: { $in: id } }, data);
        }
    }

    , changeOrdering: async (cids, orderings, options = {}) => {
        let data = {
            ordering: parseInt(orderings)
            , modified: {
                user_id: 0
                , user_name: 'admin'
                , time: Date.now()
            }
        };

        if (Array.isArray(cids)) { // Change ordering - Multi
            for (let index = 0; index < cids.length; index++) {
                data.ordering = parseInt(orderings[index]);
                await ArticlesModel.updateOne({ _id: cids[index] }, data);
            }
            return Promise.resolve('Succsess');
        } else { // Change ordering - One
            return ArticlesModel.updateOne({ _id: cids }, data);
        }
    }

    , deleteItem: async (id, options = {}) => {
        if (options.task === 'delete-one') {
            await ArticlesModel.findById(id).then((item) => {
                FileHelpers.removeFile(uploadFolder, item.thumb);
            });

            return ArticlesModel.deleteOne({ _id: id });
        }

        if (options.task === 'delete-multi') {
            if (Array.isArray(id)) {
                for (let index = 0; index < id.length; index++) {
                    await ArticlesModel.findById(id[index]).then((item) => {
                        FileHelpers.removeFile(uploadFolder, item.thumb);
                    });
                }
            } else {
                await ArticlesModel.findById(id).then((item) => {
                    FileHelpers.removeFile(uploadFolder, item.thumb);
                });
            }

            return ArticlesModel.deleteMany({ _id: { $in: id } });
        }
    }

    , saveItem: (item, options = {}) => {
        if (options.task === 'add') {
            item.created = {
                user_id: 0
                , user_name: 'admin'
                , time: Date.now()
            };
            item.category = {
                id: item.category_id,
                name: item.category_name,
            }
            return new ArticlesModel(item).save();
        }

        if (options.task === 'edit') {
            return ArticlesModel.updateOne({ _id: item.id }, {
                name: item.name
                , ordering: parseInt(item.ordering)
                , status: item.status
                , special: item.special
                , content: item.content
                , thumb: item.thumb
                , category: {
                    id: item.category_id,
                    name: item.category_name,
                }
                , modified: {
                    user_id: 0
                    , user_name: 'admin'
                    , time: Date.now()
                }
            });
        }

        if (options.task === 'change-category-name') {
            return ArticlesModel.updateMany({ 'category.id': item.id }, {
                category: {
                    id: item.id,
                    name: item.name
                }
            });
        }
    }
}