const UsersModel    = require(__path_models + '/users');
const systemConfig  = require(__path_configs + '/system');
const ParamsHelpers = require(__path_helpers + '/params');

module.exports = async (req, res, next) => {
    try {
        let userId = ParamsHelpers.getParam(req.session, systemConfig.sess_login, '');
        if (userId) {
            let user = await UsersModel.getItem(userId);
            res.locals.userInfo = user;
        } else {
            res.locals.userInfo = {};
        }
    } catch(error) {
        res.locals.userInfo = {};
    }

    next();
}