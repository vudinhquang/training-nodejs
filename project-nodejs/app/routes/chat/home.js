var express = require('express');
var router = express.Router();

const folderView	 = __path_views_chat + '/pages/home/';
const layoutChat	 = __path_views_chat + '/main';

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render(`${folderView}index`, {
		layout: layoutChat
	});
});

module.exports = router;
