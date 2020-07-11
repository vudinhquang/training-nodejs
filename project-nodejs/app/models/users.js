var md5 = require('md5');

const jwt = require('jsonwebtoken') // Mã hoá 1 jsonObject thành token(string)
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const UsersModel  = require(__path_schemas + '/users');
const FileHelpers = require(__path_helpers + '/file');
const uploadFolder = 'public/uploads/users/';
const secretString = "secret string" // tự cho 1 string tuỳ ý

module.exports = {
    listItems: (params, options = {}) => {
        let objWhere = {};
        if (params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if (params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        let sort		  = {};
        sort[params.sortField]   = params.sortType;

        if(params.groupID !== 'allvalue') objWhere['group.id'] = params.groupID; 
	    if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

        return UsersModel
            .find(objWhere)
            .select('name avatar status ordering created modified group.name')
            .sort(sort)
            .skip((params.pagination.currentPage - 1) * params.pagination.totalItemsPerPage)
            .limit(params.pagination.totalItemsPerPage);
    }

    //Viết hàm login user
    , loginUser: async (item) => {
        try {       
            let foundUser = await UsersModel.findOne({username: item.username.trim()})
                                .exec()
            if(!foundUser) {
                throw "User không tồn tại"
            }
            if(foundUser.status !== "active") {
                throw "User chưa kích hoạt, bạn phải mở mail kích hoạt trước"               
            }
            let encryptedPassword = foundUser.password;
            if (md5(item.password) === encryptedPassword) {
                // Đăng nhập thành công
                let jsonObject = {
                    id: foundUser._id
                };
                let tokenKey = await jwt.sign(jsonObject, 
                                    secretString, {
                                        expiresIn: 86400 // Expire trong 24 giờ(86400)
                                    });            
                // Trả về thông tin user kèm tokenKey
                let userObject = await foundUser.toObject();        
                userObject.tokenKey = tokenKey;
                
                return userObject;
            } else {
                throw "Tên user hoặc mật khẩu sai";
            }
        } catch(error) {
            throw error;
        }
    }

    , verifyJWT: async (tokenKey) => {
        try {        
            let decodedJson = await jwt.verify(tokenKey, secretString);
            if(Date.now() / 1000 >  decodedJson.exp) {
                throw "Token hết hạn, mời bạn login lại"
            }

            let foundUser = await UsersModel.findById(decodedJson.id);
            if (!foundUser) {
                throw "Ko tìm thấy user với token này"
            }
            return foundUser
        } catch(error) {
            throw error
        }                 
    }

    , getItem: (id, options = {}) => {
        return UsersModel.findById(id);
    }

    , getItemByUserName: (username, options = null) => {
        if (options === null) {
            return UsersModel.find({status: 'active', username: username})
                            .select('username password avatar status group.name')
        }
    }

    , countItems: (params, options = {}) => {
        let objWhere = {};
        if (params.groupID !== 'allvalue') objWhere['group.id'] = params.groupID;
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
                FileHelpers.removeFile(uploadFolder, item.avatar);
            });

            return UsersModel.deleteOne({ _id: id });
        }

        if(options.task === 'delete-multi'){
            if(Array.isArray(id)){
                for(let index = 0; index < id.length; index++){
                    await UsersModel.findById(id[index]).then((item) => {
                        FileHelpers.removeFile(uploadFolder, item.avatar);
                    });
                }
            }else{
                await UsersModel.findById(id).then((item) => {
                    FileHelpers.removeFile(uploadFolder, item.avatar);
                });
            }

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
                        , avatar: item.avatar
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