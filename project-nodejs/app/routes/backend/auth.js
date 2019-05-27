var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const systemConfig  = require(__path_configs + '/system');
const notify	    = require(__path_configs + '/notify');
const folderView	= __path_views_admin + '/pages/auth';
const layoutLogin   = __path_views_admin + '/login';
const linkIndex		= '/' + systemConfig.prefixAdmin + '/dashboard'
const linkLogin		= '/' + systemConfig.prefixAdmin + '/auth/login'
const ValidateLogin	= require(__path_validators + '/login');

/* GET logout page. */
router.get('/logout', function(req, res, next) {
});

/* GET login page. */
router.get('/login', function(req, res, next) {
	let item	= {'email': '', 'password': ''};
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
		console.log('OK 123');
		passport.authenticate('local', { 
			successRedirect: linkIndex,
			failureRedirect: linkLogin
		})(req, res, next);
	}
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log(username + '----' + password);
		return done(null, false);
	}
));

module.exports = router;