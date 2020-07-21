var express = require('express');
var router = express.Router();

const middleAuthenticationBackend = require(__path_middleware + '/auth-backend');

router.use('/', middleAuthenticationBackend, require('./home'));
router.use('/dashboard', require('./dashboard'));
router.use('/items', require('./items'));
router.use('/groups', require('./groups'));
router.use('/users', require('./users'));
router.use('/category', require('./categories'));
router.use('/article', require('./article'));
router.use('/rooms', require('./rooms'));
module.exports = router;