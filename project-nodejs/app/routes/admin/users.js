var express = require('express');
var router = express.Router();
const util = require('util');

const systemConfig = require(__path_configs + '/system');
const notify = require(__path_configs + '/notify');
const UsersModel = require(__path_models + '/users');
const GroupsModel = require(__path_models + '/groups');
const ValidateUsers = require(__path_validators + '/users');
const UtilsHelpers = require(__path_helpers + '/utils');
const FileHelpers = require(__path_helpers + '/file');
const ParamsHelpers = require(__path_helpers + '/params');

const linkIndex = '/' + systemConfig.prefixAdmin + '/users';
const pageTitleIndex = 'User Managment';
const pageTitleAdd = pageTitleIndex + ' - Add';
const pageTitleEdit = pageTitleIndex + ' - Edit';
const folderView = __path_views_admin + '/pages/users';
const uploadAvatar = FileHelpers.uploadFile('avatar', '/users', 10, 1, 'jpeg|jpg|png|gif');

// Test upload - form
router.get('/upload', (req, res, next) => {
	let errors = null;
	res.render(folderView + '/upload', {
		pageTitle: pageTitleIndex
		, errors
	});
});

// Test upload - post
router.post('/upload', (req, res, next) => {
	uploadAvatar(req, res, function (err) {
		let errors = [];
		if (err) {
			if (err.code === 'LIMIT_FILE_SIZE') {
				errors.push({ 'param': 'avatar', 'msg': 'Kích thước file upload quá lớn' });
			}

			if (err.extname) {
				errors.push({ 'param': 'avatar', 'msg': err.extname });
			}
		}
		res.render(folderView + '/upload', {
			pageTitle: pageTitleIndex
			, errors
		});
	});
});

// List users
router.get('(/status/:status)?', async (req, res, next) => {
	let params = {};
	params.keyword = ParamsHelpers.getParam(req.query, 'keyword', '');
	params.currentStatus = ParamsHelpers.getParam(req.params, 'status', 'all');
	params.sortField = ParamsHelpers.getParam(req.session, 'sort_field', 'ordering');
	params.sortType = ParamsHelpers.getParam(req.session, 'sort_type', 'asc');
	params.groupID = ParamsHelpers.getParam(req.session, 'group_id', 'allvalue');
	req.session.sort_field = req.session.sort_type = req.session.group_id = null;

	params.pagination = {
		totalItems: 1,
		totalItemsPerPage: 5,
		currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', '1')),
		pageRanges: 3
	};

	let groupsItems = [];
	let statusFilter = await UtilsHelpers.createFilterStatus(params.currentStatus, 'users');

	await GroupsModel.listItemsInSelectbox(params).then((items) => {
		groupsItems = items;
		groupsItems.unshift({ _id: 'allvalue', name: 'All group' });
	});

	await UsersModel.countItems(params).then((data) => {
		params.pagination.totalItems = data;
	});

	UsersModel.listItems(params)
		.then((items) => {
			res.render(folderView + '/list', {
				pageTitle: pageTitleIndex,
				items,
				statusFilter,
				groupsItems,
				params
			});
		});
});

// Change status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');
	let id = ParamsHelpers.getParam(req.params, 'id', '');

	UsersModel.changeStatus(id, currentStatus, { 'task': 'update-one' }).then((result) => {
		req.flash('success', notify.CHANGE_STATUS_SUCCSESS);
		res.redirect(linkIndex);
	});
});

// Change status - Multi
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');

	UsersModel.changeStatus(req.body.cid, currentStatus, { 'task': 'update-multi' }).then((result) => {
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCSESS, result.n));
		res.redirect(linkIndex);
	});
});

// Change ordering
router.post('/change-ordering', function (req, res, next) {
	let cids = req.body.cid;
	let orderings = req.body.ordering;

	UsersModel.changeOrdering(cids, orderings).then((result) => {
		req.flash('success', notify.CHANGE_ORDERING_SUCCESS);
		res.redirect(linkIndex);
	});
});

// Delete image
// router.get('/delete/:id', (req, res, next) => {
// 	let id = ParamsHelpers.getParam(req.params, 'id', '');
// 	fs.unlink('public/uploads/users/abc.jpg', (err) => {
// 		if (err) throw err;
// 	});
// });

// Delete item
router.get('/delete/:id', (req, res, next) => {
	let id = ParamsHelpers.getParam(req.params, 'id', '');

	UsersModel.deleteItem(id, { 'task': 'delete-one' }).then((result) => {
		req.flash('success', notify.DELETE_SUCCESS);
		res.redirect(linkIndex);
	});
});

// Delete - Multi
router.post('/delete', (req, res, next) => {
	UsersModel.deleteItem(req.body.cid, { 'task': 'delete-multi' }).then((result) => {
		req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, result.n));
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
		group_id: 'allvalue',
		group_name: ''
	};
	let errors = null;
	let groupsItems = [];

	await GroupsModel.listItemsInSelectbox().then((items) => {
		groupsItems = items;
		groupsItems.unshift({ _id: 'allvalue', name: 'All group' });
	});

	if (id === '') {	//Add
		res.render(folderView + '/form', {
			pageTitle: pageTitleAdd,
			item,
			errors,
			groupsItems
		});
	} else {	//Edit
		UsersModel.getItem(id).then((item) => {
			item.group_id = item.group.id;
			item.group_name = item.group.name;
			res.render(folderView + '/form', {
				pageTitle: pageTitleEdit,
				item,
				errors,
				groupsItems
			});
		});
	}
});

// Add and Edit
router.post('/save', (req, res, next) => {
	uploadAvatar(req, res, async (errUpload) => {
		let item = Object.assign({}, req.body);
		let task = (item.id !== '') ? 'edit' : 'add';
		let errors = ValidateUsers.validator(req, errUpload, task);

		if (errors.length > 0) {
			let pageTitle = (task === 'add') ? pageTitleAdd : pageTitleEdit;
			let groupsItems = [];
			if (req.file) FileHelpers.removeFile('public/uploads/users/', req.file.filename);  // Xóa tấm hình khi form không hợp lệ
			await GroupsModel.listItemsInSelectbox().then((items) => {
				groupsItems = items;
				groupsItems.unshift({ _id: 'allvalue', name: 'All group' });
			});
			if(task === 'edit') item.avatar = item.image_old;
			res.render(folderView + '/form', {
				pageTitle,
				item,
				errors,
				groupsItems
			});
		} else {
			let message = (task === 'add') ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
			if(!req.file){ // không có upload lại hình
				item.avatar = item.image_old;
			} else{
				item.avatar = req.file.filename;
				if(item.image_old && task == 'edit') FileHelpers.removeFile('public/uploads/users/', item.image_old);
			}
			UsersModel.saveItem(item, { 'task': task }).then(() => {
				req.flash('success', message);
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

// Filter Group
router.get('/filter-group/:group_id', (req, res, next) => {
	req.session.group_id = ParamsHelpers.getParam(req.params, 'group_id', 'allvalue');

	res.redirect(linkIndex);
});

module.exports = router;