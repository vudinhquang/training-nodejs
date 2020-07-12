var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + '/params');
const ArticleModel 	= require(__path_models + '/article');

const folderView	 = __path_views_blog + '/pages/article';
const layoutBlog    = __path_views_blog + '/frontend';

/* GET home page. */
router.get('/:id', async (req, res, next) => {
	let idArticle 		= ParamsHelpers.getParam(req.params, 'id', '');
	let itemsRandom   = [];
	let itemsOthers		= [];

	await ArticleModel.listItemsFrontend({}, {'task': 'items-random'}).then((items) => { 
		itemsRandom = items; 
	});

	await ArticleModel.getItemFrontend(idArticle, {} ).then( (item) => { 
		itemArticle = item; 
	});

	await ArticleModel.listItemsFrontend(itemArticle, {task: 'items-others'} ).then((items) => { 
		itemsOthers = items; 
	});

	res.render(folderView + '/index', {
		layout: layoutBlog,
		top_post: false,
		itemsOthers,
		itemArticle,
		itemsRandom
	});
});

module.exports = router;
