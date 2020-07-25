const StringHelpers 	= require(__path_helpers + '/string');
const systemConfig  = require(__path_configs + '/system');
const ParamsHelpers = require(__path_helpers + '/params');
const linkLogin		= StringHelpers.formatLink('/' + systemConfig.prefixChat + '/auth/login');

module.exports = async(req, res, next) => {
    if(ParamsHelpers.getParam(req.session, systemConfig.sess_login, '')) {
        return next();
    } else {
        res.redirect(linkLogin);
    }
}