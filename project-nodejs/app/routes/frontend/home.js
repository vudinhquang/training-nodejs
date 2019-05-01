var express = require('express');
var router = express.Router();

const ArticleModel 	= require(__path_models + '/article');

const folderView = __path_views_blog + '/pages/home';
const layoutBlog = __path_views_blog + '/frontend';

/* GET home page. */
router.get('/', async (req, res, next) => {
	let itemsSpecial = [];
	await ArticleModel.listItemsSpecial(req.params).then((items) => {
		itemsSpecial = items
	})

	res.render(folderView + '/index', {
		layout: layoutBlog,
		top_post: true,
		itemsSpecial
	});
});

module.exports = router;
