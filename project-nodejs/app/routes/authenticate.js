var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const systemConfig  = require(__path_configs + '/system');
const linkLogin		= '/' + systemConfig.prefixAdmin + '/auth/login'
const UsersModel    = require(__path_models + '/users');

module.exports = {
    isAuthorized: async(req, res, next) => {
        try {        
            let user = await UsersModel.verifyJWT(localStorage.getItem('tokenKey'));
            return next();
        } catch(error) {
            localStorage.removeItem('logIn');
            localStorage.removeItem('tokenKey');
            res.redirect(linkLogin);
        }
    }
}