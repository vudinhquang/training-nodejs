var express = require('express');
var router = express.Router();

const ArticleModel 	= require(__path_models + '/article');
const CategoryModel = require(__path_models + '/categories');

const folderView = __path_views_blog + '/pages/category';
const layoutBlog = __path_views_blog + '/frontend';

/* GET home page. */
router.get('/:id', async (req, res, next) => {
	let itemsCategory = [];

	await CategoryModel.listItemsFrontend({}, {'task': 'items-in-menu'}).then((items) => { 
		itemsCategory = items; 
	});

	res.render(folderView + '/index', {
		layout: layoutBlog,
		top_post: false,
		itemsCategory
	});
});

module.exports = router;
