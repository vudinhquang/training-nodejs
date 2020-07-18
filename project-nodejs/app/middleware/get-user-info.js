var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const UsersModel    = require(__path_models + '/users');

module.exports = async (req, res, next) => {
    try {        
        let user = await UsersModel.verifyJWT(localStorage.getItem('tokenKey'));
        res.locals.userInfo = user;
    } catch(error) {
        res.locals.userInfo = {};
    }

    next();
}