var express = require('express');
var router = express.Router();

const CategoryModel = require(__path_models + '/categories');
const ArticleModel 	= require(__path_models + '/article');

const folderView	 = __path_views_blog + '/pages/about';
const layoutBlog    = __path_views_blog + '/frontend';

/* GET about page. */
router.get('/', async (req, res, next) => {
	let itemsCategory   = [];
	// let itemsRandom     = [];

	await CategoryModel.listItemsFrontend({}, {'task': 'items-in-menu'}).then((items) => { 
		itemsCategory = items; 
	});

	// await ArticleModel.listItemsFrontend({}, {'task': 'items-random'}).then((items) => { 
	// 	itemsRandom = items; 
	// });

	res.render(folderView + '/index', {
		layout: layoutBlog,
		top_post: false,
		itemsCategory,
		// itemsRandom
	});
});

module.exports = router;
