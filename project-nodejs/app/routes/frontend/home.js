var express = require('express');
var router = express.Router();

const ArticleModel 	= require(__path_models + '/article');

const folderView = __path_views_blog + '/pages/home';
const layoutBlog = __path_views_blog + '/frontend';

/* GET home page. */
router.get('/', (req, res, next) => {
	ArticleModel.listItemsSpecial(req.params).then((items) => {
		res.render(folderView + '/index', {
			layout: layoutBlog,
			top_post: true,
			items
		});
	})
});

module.exports = router;
