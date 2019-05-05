var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + '/params');
const ArticleModel 	= require(__path_models + '/article');
const CategoryModel = require(__path_models + '/categories');

const folderView	 = __path_views_blog + '/pages/article';
const layoutBlog    = __path_views_blog + '/frontend';

/* GET home page. */
router.get('/:id', async (req, res, next) => {
	let idArticle 		= ParamsHelpers.getParam(req.params, 'id', '');
	let itemsCategory   = [];
	let itemsRandom   = [];

	await CategoryModel.listItemsFrontend({}, {'task': 'items-in-menu'}).then((items) => { 
		itemsCategory = items; 
	});

	await ArticleModel.listItemsFrontend({}, {'task': 'items-random'}).then((items) => { 
		itemsRandom = items; 
	});

	await ArticleModel.getItemFrontend(idArticle, {} ).then( (item) => { 
		itemArticle = item; 
	});

	res.render(folderView + '/index', {
		layout: layoutBlog,
		top_post: false,
		itemsCategory,
		itemArticle,
		itemsRandom
	});
});

module.exports = router;
