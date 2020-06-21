var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var md5 = require('md5');

const systemConfig  = require(__path_configs + '/system');
const notify	    = require(__path_configs + '/notify');
const UsersModel = require(__path_models + '/users');
const folderView	= __path_views_admin + '/pages/auth';
const layoutLogin   = __path_views_admin + '/login';
const linkIndex		= '/' + systemConfig.prefixAdmin + '/dashboard'
const linkLogin		= '/' + systemConfig.prefixAdmin + '/auth/login'
const ValidateLogin	= require(__path_validators + '/login');

/* GET logout page. */
router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect(linkLogin);
});

/* GET login page. */
router.get('/login', function(req, res, next) {
	let item	= {'username': '', 'password': ''};
	let errors   = null;

	res.render(folderView + '/login', { layout: layoutLogin, errors, item });
});

/* POST login page. */
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
	done(null, user._id);
});
  
passport.deserializeUser(function(id, done) {
	UsersModel.getItem(id, null).then((user) =>{
		done(null, user);
	});
});

module.exports = router;