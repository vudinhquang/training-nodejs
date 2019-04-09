var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const flash = require('express-flash-notification');
const validator = require('express-validator');
const session = require('express-session');

var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');

const systemConfig   = require('./configs/system');
const databaseConfig = require('./configs/database');

mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster0-jhlkz.mongodb.net/${databaseConfig.database}?retryWrites=true`, { useNewUrlParser: true });

var app = express();

app.use(cookieParser());
app.use(session({
	secret: 'qtgbjhyd',
	resave: false,
	saveUninitialized: true,
}));
app.use(flash(app, {
	viewName: 'elements/notify',
}));

app.use(validator());
// app.use(validator(
// 	{
// 		customValidators:{
// 			isNotEqual: (val1, val2) =>{
// 				return val1 !== val2;
// 			}
// 		}
// 	}
// ));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'backend');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Local variable
app.locals.systemConfig = systemConfig;

// Setup router
app.use(`/${systemConfig.prefixAdmin}`, require('./routes/backend/index'));
app.use('/', require('./routes/frontend/index'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('pages/error', { pageTitle: 'Page Not Found' });
});

module.exports = app;
