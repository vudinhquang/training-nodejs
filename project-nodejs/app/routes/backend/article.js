var express = require('express');
var router = express.Router();
const util = require('util');

const systemConfig = require(__path_configs + '/system');
const notify = require(__path_configs + '/notify');
const ArticleModel = require(__path_models + '/article');
const CategoryModel = require(__path_models + '/categories');
const ValidateArticle = require(__path_validators + '/article');
const UtilsHelpers = require(__path_helpers + '/utils');
const FileHelpers = require(__path_helpers + '/file');
const ParamsHelpers = require(__path_helpers + '/params');

const linkIndex = '/' + systemConfig.prefixAdmin + '/article';
const pageTitleIndex = 'Article Managment';
const pageTitleAdd = pageTitleIndex + ' - Add';
const pageTitleEdit = pageTitleIndex + ' - Edit';
const folderView = __path_views_admin + '/pages/article';
const uploadThumb = FileHelpers.uploadFile('thumb', '/article', 10, 1, 'jpeg|jpg|png|gif');

// List articles
router.get('(/status/:status)?', async (req, res, next) => {
	let params = {};
	params.keyword = ParamsHelpers.getParam(req.query, 'keyword', '');
	params.currentStatus = ParamsHelpers.getParam(req.params, 'status', 'all');
	params.sortField = ParamsHelpers.getParam(req.session, 'sort_field', 'ordering');
	params.sortType = ParamsHelpers.getParam(req.session, 'sort_type', 'asc');
	params.categoryID = ParamsHelpers.getParam(req.session, 'category_id', 'allvalue');
	req.session.destroy();

	params.pagination = {
		totalItems: 1,
		totalItemsPerPage: 5,
		currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', '1')),
		pageRanges: 3
	};

	let categoryItems = [];
	let statusFilter = await UtilsHelpers.createFilterStatus(params.currentStatus, 'article');

	await CategoryModel.listItemsInSelectbox(params).then((items) => {
		categoryItems = items;
		categoryItems.unshift({ _id: 'allvalue', name: 'All category' });
	});

	await ArticleModel.countItems(params).then((data) => {
		params.pagination.totalItems = data;
	});

	ArticleModel.listItems(params)
		.then((items) => {
			res.render(folderView + '/list', {
				pageTitle: pageTitleIndex,
				items,
				statusFilter,
				categoryItems,
				params
			});
		});
});

// Change status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');
	let id = ParamsHelpers.getParam(req.params, 'id', '');

	ArticleModel.changeStatus(id, currentStatus, { 'task': 'update-one' }).then((result) => {
		req.flash('success', notify.CHANGE_STATUS_SUCCSESS, false);
		res.redirect(linkIndex);
	});
});

// Change status - Multi
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');

	ArticleModel.changeStatus(req.body.cid, currentStatus, { 'task': 'update-multi' }).then((result) => {
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCSESS, result.n), false);
		res.redirect(linkIndex);
	});
});

// Change ordering
router.post('/change-ordering', function (req, res, next) {
	let cids = req.body.cid;
	let orderings = req.body.ordering;

	ArticleModel.changeOrdering(cids, orderings).then((result) => {
		req.flash('success', notify.CHANGE_ORDERING_SUCCESS, false);
		res.redirect(linkIndex);
	});
});

// Delete item
router.get('/delete/:id', (req, res, next) => {
	let id = ParamsHelpers.getParam(req.params, 'id', '');

	ArticleModel.deleteItem(id, { 'task': 'delete-one' }).then((result) => {
		req.flash('success', notify.DELETE_SUCCESS, false);
		res.redirect(linkIndex);
	});
});

// Delete - Multi
router.post('/delete', (req, res, next) => {
	ArticleModel.deleteItem(req.body.cid, { 'task': 'delete-multi' }).then((result) => {
		req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, result.n), false);
		res.redirect(linkIndex);
	});
});

// Form
router.get('/form(/:id)?', async (req, res, next) => {
	let id = ParamsHelpers.getParam(req.params, 'id', '');
	let item = {
		name: '',
		ordering: '',
		status: 'novalue',
		category_id: 'allvalue',
		category_name: ''
	};
	let errors = null;
	let categoryItems = [];

	await CategoryModel.listItemsInSelectbox().then((items) => {
		categoryItems = items;
		categoryItems.unshift({ _id: 'allvalue', name: 'All category' });
	});

	if (id === '') {	//Add
		res.render(folderView + '/form', {
			pageTitle: pageTitleAdd,
			item,
			errors,
			categoryItems
		});
	} else {	//Edit
		ArticleModel.getItem(id).then((item) => {
			item.category_id = item.category.id;
			item.category_name = item.category.name;
			res.render(folderView + '/form', {
				pageTitle: pageTitleEdit,
				item,
				errors,
				categoryItems
			});
		});
	}
});

// Add and Edit
router.post('/save', (req, res, next) => {
	uploadThumb(req, res, async (errUpload) => {
		let item = Object.assign({}, req.body);
		let task = (item.id !== '') ? 'edit' : 'add';
		let errors = ValidateArticle.validator(req, errUpload, task);

		if (errors.length > 0) {
			let pageTitle = (task === 'add') ? pageTitleAdd : pageTitleEdit;
			let categoryItems = [];
			if (req.file) FileHelpers.removeFile('public/uploads/article/', req.file.filename, 'no-image.png');  // Xóa tấm hình khi form không hợp lệ
			await CategoryModel.listItemsInSelectbox().then((items) => {
				categoryItems = items;
				categoryItems.unshift({ _id: 'allvalue', name: 'All category' });
			});
			if(task === 'edit') item.thumb = item.image_old;
			res.render(folderView + '/form', {
				pageTitle,
				item,
				errors,
				categoryItems
			});
		} else {
			let message = (task === 'add') ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
			if(!req.file){ // không có upload lại hình
				item.thumb = item.image_old;
			} else{
				item.thumb = req.file.filename;
				if(item.image_old && task == 'edit') FileHelpers.removeFile('public/uploads/article/', item.image_old, 'no-image.png');
			}
			ArticleModel.saveItem(item, { 'task': task }).then(() => {
				req.flash('success', message, false);
				res.redirect(linkIndex);
			});
		}
	});
});

// Sort
router.get('/sort/:sort_field/:sort_type', (req, res, next) => {
	req.session.sort_field = ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type = ParamsHelpers.getParam(req.params, 'sort_type', 'asc');

	res.redirect(linkIndex);
});

// Filter Category
router.get('/filter-category/:category_id', (req, res, next) => {
	req.session.category_id = ParamsHelpers.getParam(req.params, 'category_id', 'allvalue');

	res.redirect(linkIndex);
});

module.exports = router;