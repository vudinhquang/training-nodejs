const StringHelpers 	= require(__path_helpers + '/string');
const systemConfig  = require(__path_configs + '/system');
const ParamsHelpers = require(__path_helpers + '/params');
const linkLogin		= StringHelpers.formatLink('/' + systemConfig.prefixChat + '/auth/login');
const UsersModel    = require(__path_models + '/users');
const linkNoPermission	 = StringHelpers.formatLink('/' + systemConfig.prefixChat + '/auth/no-permission');

module.exports = async(req, res, next) => {
    try {
        let userId = ParamsHelpers.getParam(req.session, systemConfig.sess_login, '');
        if (userId) {
            let user = await UsersModel.getItem(userId);
            if(user.username === "admin") {
                return next();
            } else {
                return res.redirect(linkNoPermission);
            }
        } else {
            return res.redirect(linkLogin);
        }
    } catch(error) {
        res.redirect(linkLogin);
    }
}