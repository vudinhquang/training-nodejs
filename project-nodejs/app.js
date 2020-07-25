var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');

var flash = require('connect-flash');
const validator = require('express-validator');
const session = require('express-session');
var cookieSession = require('cookie-session');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
var socket_io    = require( "socket.io" );

const pathConfig = require('./path');

// Define Path
global.__base = __dirname;
global.__path_app = __base + '/' + pathConfig.folder_app;
global.__path_configs = __path_app + '/' + pathConfig.folder_configs;
global.__path_helpers = __path_app + '/' + pathConfig.folder_helpers;

global.__path_routes 		= __path_app + '/' + pathConfig.folder_routes;
global.__path_routes_admin  = __path_routes + '/' + pathConfig.folder_module_admin;
global.__path_routes_blog   = __path_routes + '/' + pathConfig.folder_module_blog;
global.__path_routes_chat   = __path_routes + '/' + pathConfig.folder_module_chat;

global.__path_schemas = __path_app + '/' + pathConfig.folder_schemas;
global.__path_models = __path_app + '/' + pathConfig.folder_models;
global.__path_validators = __path_app + '/' + pathConfig.folder_validators;
global.__path_middleware= __path_app + '/' + pathConfig.folder_middleware;

global.__path_views = __path_app + '/' + pathConfig.folder_views;
global.__path_views_admin = __path_views + '/' + pathConfig.folder_module_admin;
global.__path_views_blog = __path_views + '/' + pathConfig.folder_module_blog;
global.__path_views_chat  = __path_views + '/' + pathConfig.folder_module_chat;

global.__path_public = __base + '/' + pathConfig.folder_public;
global.__path_uploads = __path_public + '/' + pathConfig.folder_uploads;

const systemConfig = require(__path_configs + '/system');
const databaseConfig = require(__path_configs + '/database');

mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster0-jhlkz.mongodb.net/${databaseConfig.database}?retryWrites=true`, { useNewUrlParser: true });

var app = express();

// Socket.io
var io           = socket_io();
app.io           = io;

app.use(cookieParser());
app.use(cookieSession({
	name: systemConfig.sess_name,
	saveUninitialized: false,
	resave: false,
	secret: systemConfig.sess_secret,
	cookie: {
		maxAge: systemConfig.sess_lifetime,
		sameSite: true,
		secure: systemConfig.sess_secure
	}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
	res.locals.messages = req.flash();
	next();
});

app.use(validator());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', __path_views_admin + '/backend');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Local variable
app.locals.systemConfig = systemConfig;
app.locals.moment = require('moment');

// Setup router
app.use(`/${systemConfig.prefixAdmin}`, require(__path_routes_admin + '/index'));
app.use(`/${systemConfig.prefixBlog}`, require(__path_routes_blog + '/index'));
app.use(`/${systemConfig.prefixChat}`, require(__path_routes_chat + '/index')(io));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(async (err, req, res, next) => {
	// set locals, only providing error in development
	// res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	if (systemConfig.env == "dev") {
		res.status(err.status || 500);
		res.render(__path_views_admin + '/pages/error', { pageTitle: 'Page Not Found ' });
	}

	// render the error page
	if (systemConfig.env == "production") {
		const CategoryModel     = require(__path_models + '/categories');
		const UsersModel    = require(__path_models + '/users');
		
		await CategoryModel
		.listItemsFrontend(null, {task: 'items-in-menu'} )
		.then( (items) => { res.locals.itemsCategory = items; });

		try {        
			let user = await UsersModel.verifyJWT(localStorage.getItem('tokenKey'));
			res.locals.userInfo = user;
		} catch(error) {
			res.locals.userInfo = {};
		}

		res.status(err.status || 500);
		res.render(__path_views_blog + '/pages/error', {
			top_post: false,
			layout: __path_views_blog + '/frontend'
		});
	}

});

module.exports = app;
