var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const StringHelpers 	= require(__path_helpers + '/string');
const systemConfig  = require(__path_configs + '/system');
const linkLogin		= StringHelpers.formatLink('/' + systemConfig.prefixChat + '/auth/login');
const UsersModel    = require(__path_models + '/users');
const linkNoPermission	 = StringHelpers.formatLink('/' + systemConfig.prefixChat + '/auth/no-permission');

module.exports = async(req, res, next) => {
    try {        
        let user = await UsersModel.verifyJWT(localStorage.getItem('tokenKey'));
        if(user.username) {
            return next();
        }
    } catch(error) {
        res.redirect(linkLogin);
    }
}