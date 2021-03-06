var express = require('express');
var router = express.Router();
/*
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var md5 = require('md5');
*/
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const middleGetUserInfo         = require(__path_middleware + '/get-user-info');

const StringHelpers 	= require(__path_helpers + '/string');
const systemConfig  = require(__path_configs + '/system');
const notify	    = require(__path_configs + '/notify');
const UsersModel = require(__path_models + '/users');
const ParamsHelpers = require(__path_helpers + '/params');
const folderView	= __path_views_chat + '/pages/auth';
const layoutLogin   = __path_views_chat + '/login';
const layoutChat   	= __path_views_chat + '/main';
const linkIndex		= StringHelpers.formatLink('/' + systemConfig.prefixChat);
const linkLogin		= StringHelpers.formatLink('/' + systemConfig.prefixChat + '/auth/login');
const ValidateLogin	= require(__path_validators + '/login');

/* GET logout page. */
router.get('/logout', function(req, res, next) {
	req.session = null;
	res.clearCookie(systemConfig.userId);
	return res.redirect(linkLogin);
});

/* GET login page. */
router.get('/login', async (req, res, next) => {
	let item	= {'username': '', 'password': ''};
	let errors   = null;

	if(req.session.sess_login) {
		return res.redirect(linkIndex);
	} else {
		return res.render(folderView + '/login', { layout: layoutLogin, errors, item });
	}
});

/* GET dashboard page. */
router.get('/no-permission', middleGetUserInfo, function(req, res, next) {
	res.render(folderView + '/no-permission', { layout: layoutChat, top_post: false });
});

/* POST login page. */
/*
router.post('/login', function(req, res, next) {
	req.body = JSON.parse(JSON.stringify(req.body));
	
	let item 	= Object.assign(req.body);
	let errors  = ValidateLogin.validator(req);
	if(errors.length > 0) { 
		res.render(folderView + '/login', {  layout: layoutLogin, item, errors });
	}else {
		passport.authenticate('local', { 
			successRedirect: linkIndex,
			failureRedirect: linkLogin,
			failureFlash: true
		})(req, res, next);
	}
});
*/

router.post('/login', async (req, res, next) => {
	req.body = JSON.parse(JSON.stringify(req.body));
	
	let item 	= Object.assign(req.body);
	let errors  = ValidateLogin.validator(req);
	if(errors.length > 0) { 
		res.render(folderView + '/login', {  layout: layoutLogin, item, errors });
	}else {
		try {
            let foundUser = await UsersModel.loginUser(item);			
			req.session.userId = ParamsHelpers.getParam(req.session, systemConfig.sess_login, foundUser._id);
            res.redirect(linkIndex);
		} catch(error) {
			req.flash('danger', notify.ERROR_LOGIN );
			res.redirect(linkLogin);
		}
	}
});
/*
passport.use(new LocalStrategy(
	function(username, password, done) {
		UsersModel.getItemByUserName(username, null).then((users) => {
			let user = users[0];
			if (!user) {
				return done(null, false, { message: notify.ERROR_LOGIN});
			}else{
				if (md5(password) !== user.password) {
					return done(null, false, { message: notify.ERROR_LOGIN});
				}else {
					console.log('Đăng nhập ok');
					return done(null, user);
				}
			}
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});
  
passport.deserializeUser(function(id, done) {
	UsersModel.getItem(id, null).then((user) =>{
		done(null, user);
	});
});
*/
module.exports = router;