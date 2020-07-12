var express = require('express');
var router = express.Router();

const ArticleModel 	= require(__path_models + '/article');

const folderView	 = __path_views_blog + '/pages/about';
const layoutBlog    = __path_views_blog + '/frontend';

/* GET about page. */
router.get('/', async (req, res, next) => {
	// let itemsRandom     = [];

	// await ArticleModel.listItemsFrontend({}, {'task': 'items-random'}).then((items) => { 
	// 	itemsRandom = items; 
	// });

	res.render(folderView + '/index', {
		layout: layoutBlog,
		top_post: false
		// itemsRandom
	});
});

module.exports = router;
