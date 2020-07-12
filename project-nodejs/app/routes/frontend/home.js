var express = require('express');
var router = express.Router();

const ArticleModel 	= require(__path_models + '/article');

const folderView = __path_views_blog + '/pages/home';
const layoutBlog = __path_views_blog + '/frontend';

/* GET home page. */
router.get('/', async (req, res, next) => {
	let itemsSpecial  = [];
	let itemsNews     = [];
	let itemsRandom   = [];

	await ArticleModel.listItemsFrontend({}, {'task': 'items-special'}).then((items) => {
		itemsSpecial = items;
	});

	await ArticleModel.listItemsFrontend({}, {'task': 'items-news'}).then((items) => {
		itemsNews = items;
	});

	await ArticleModel.listItemsFrontend({}, {'task': 'items-random'}).then((items) => { 
		itemsRandom = items; 
	});
	res.render(folderView + '/index', {
		layout: layoutBlog,
		top_post: true,
		itemsSpecial,
		itemsNews,
		itemsRandom
	});
});

module.exports = router;
