var express = require('express');
var router = express.Router();

const Authenticate = require(__path_routes + '/authenticate');

router.use('/auth', require('./auth'));
router.use('/', Authenticate.isAuthorized, require('./home'));
router.use('/dashboard', require('./dashboard'));
router.use('/items', require('./items'));
router.use('/groups', require('./groups'));
router.use('/users', require('./users'));
router.use('/category', require('./categories'));
router.use('/article', require('./article'));
module.exports = router;