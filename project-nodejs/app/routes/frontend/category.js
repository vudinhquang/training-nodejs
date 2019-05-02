var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + '/params');
const ArticleModel 	= require(__path_models + '/article');
const CategoryModel = require(__path_models + '/categories');

const folderView = __path_views_blog + '/pages/category';
const layoutBlog = __path_views_blog + '/frontend';

/* GET home page. */
router.get('/:id', async (req, res, next) => {
	let itemsCategory   = [];
	let itemsInCategory = [];
	let idCategory 		= ParamsHelpers.getParam(req.params, 'id', '');

	await CategoryModel.listItemsFrontend({}, {'task': 'items-in-menu'}).then((items) => { 
		itemsCategory = items; 
	});

	await ArticleModel.listItemsFrontend({'id': idCategory}, {task: 'items-in-category'} ).then( (items) => { 
		itemsInCategory = items; 
	});

	res.render(folderView + '/index', {
		layout: layoutBlog,
		top_post: false,
		itemsCategory,
		itemsInCategory
	});
});

module.exports = router;
