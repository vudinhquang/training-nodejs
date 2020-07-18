var express = require('express');
var router = express.Router();

const folderView	 = __path_views_chat + '/pages/home/';
const layoutChat	 = __path_views_chat + '/frontend/';

/* GET home page. */
router.get('/', function(req, res, next) {
	res.send('Hello Chat');
});

module.exports = router;
