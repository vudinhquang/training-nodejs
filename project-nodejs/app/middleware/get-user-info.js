var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const systemConfig  = require(__path_configs + '/system');
const linkLogin		= '/' + systemConfig.prefixAdmin + '/auth/login'
const UsersModel    = require(__path_models + '/users');
const linkNoPermission	 = '/' + systemConfig.prefixAdmin + '/auth/no-permission';

module.exports = async (req, res, next) => {
    try {        
        let user = await UsersModel.verifyJWT(localStorage.getItem('tokenKey'));
        res.locals.userInfo = user;
    } catch(error) {
        res.locals.userInfo = {};
    }

    next();
}