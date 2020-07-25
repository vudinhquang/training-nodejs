var express = require('express');
var router  = express.Router();
const util  = require('util');

const systemConfig   = require(__path_configs + '/system');
const notify         = require(__path_configs + '/notify');
const GroupsModel    = require(__path_models + '/groups');
const UsersModel     = require(__path_models + '/users');
const ValidateGroups = require(__path_validators + '/groups');
const UtilsHelpers   = require(__path_helpers + '/utils');
const ParamsHelpers  = require(__path_helpers + '/params');

const linkIndex = '/' + systemConfig.prefixAdmin + '/groups';
const pageTitleIndex = 'Group Managment';
const pageTitleAdd   = pageTitleIndex + ' - Add';
const pageTitleEdit  = pageTitleIndex + ' - Edit';
const folderView = __path_views_admin + '/pages/groups';

// List groups
router.get('(/status/:status)?', async (req, res, next) => {
	let params		     = {};
	params.keyword 	  = ParamsHelpers.getParam(req.query, 'keyword', '');
	params.currentStatus = ParamsHelpers.getParam(req.params, 'status', 'all');
	params.sortField 	  = ParamsHelpers.getParam(req.session, 'sort_field', 'ordering');
	params.sortType 	  = ParamsHelpers.getParam(req.session, 'sort_type', 'asc');
	req.session.sort_field = req.session.sort_type = null;

	params.pagination = {
		totalItems: 1,
		totalItemsPerPage: 5,
		currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', '1')),
		pageRanges: 3
	};

	let statusFilter  = await UtilsHelpers.createFilterStatus(params.currentStatus, 'groups');
	await GroupsModel.countItems(params).then((data) => {
		params.pagination.totalItems = data;
	});

	GroupsModel.listItems(params)
		.then((items) => {
			res.render(folderView + '/list', {
				pageTitle: pageTitleIndex,
				items,
				statusFilter,
				params
			});
		});
});

// Change status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');
	let id = ParamsHelpers.getParam(req.params, 'id', '');

	GroupsModel.changeStatus(id, currentStatus, {'task': 'update-one'}).then((result) => {
		req.flash('success', notify.CHANGE_STATUS_SUCCSESS);
		res.redirect(linkIndex);
	});
});

// Change Group ACP
router.get('/change-group-acp/:id/:group_acp', (req, res, next) => {
	let currentGroupACP = ParamsHelpers.getParam(req.params, 'group_acp', 'yes');
	let id 				= ParamsHelpers.getParam(req.params, 'id', '');

	GroupsModel.changeGroupACP(currentGroupACP, id).then((result) => {
		req.flash('success', notify.CHANGE_GROUP_ACP_SUCCSESS);
		res.redirect(linkIndex);
	});
});

// Change status - Multi
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');

	GroupsModel.changeStatus(req.body.cid, currentStatus, {'task': 'update-multi'}).then((result) => {
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCSESS, result.n));
		res.redirect(linkIndex);
	});
});

// Change ordering
router.post('/change-ordering', function (req, res, next) {
	let cids = req.body.cid;
	let orderings = req.body.ordering;
	
	GroupsModel.changeOrdering(cids, orderings).then((result) => {
		req.flash('success', notify.CHANGE_ORDERING_SUCCESS);
		res.redirect(linkIndex);
	});
});

// Delete item
router.get('/delete/:id', (req, res, next) => {
	let id = ParamsHelpers.getParam(req.params, 'id', '');
	GroupsModel.deleteItem(id, {'task': 'delete-one'}).then((result) => {
		req.flash('success', notify.DELETE_SUCCESS);
		res.redirect(linkIndex);
	});
});

// Delete - Multi
router.post('/delete', (req, res, next) => {
	GroupsModel.deleteItem(req.body.cid, {'task': 'delete-multi'}).then((result) => {
		req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, result.n));
		res.redirect(linkIndex);
	});
});

// Form
router.get('/form(/:id)?', (req, res, next) => {
	let id = ParamsHelpers.getParam(req.params, 'id', '');
	let item = {
		name: '',
		ordering: '',
		status: 'novalue'
	};
	let errors = null;
	if (id === '') {	//Add
		res.render(folderView + '/form', {
			pageTitle: pageTitleAdd,
			item,
			errors
		});
	} else {	//Edit
		GroupsModel.getItem(id).then((item) => {
			res.render(folderView + '/form', {
				pageTitle: pageTitleEdit,
				item,
				errors
			});
		});
	}
});

// Add and Edit
router.post('/save', (req, res, next) => {
	let item = Object.assign({}, req.body);
	let errors = ValidateGroups.validator(req);
	let task    = (item.id !== '') ? 'edit' : 'add';
	if(errors){
		let pageTitle = (task === 'add') ? pageTitleAdd : pageTitleEdit;
		res.render(folderView + '/form', {
			pageTitle,
			item,
			errors
		});
	}else{
		let message = (task === 'add') ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
		GroupsModel.saveItem(item, {'task': task}).then(() => {
			if(task === 'add'){
				req.flash('success', message);
				res.redirect(linkIndex);
			}else if(task === 'edit'){
				UsersModel.saveItem(item, {'task': 'change-group-name'}).then(() => {
					req.flash('success', notify.EDIT_SUCCESS);
					res.redirect(linkIndex);
				});
			}
		});
	}
});

// Sort
router.get('/sort/:sort_field/:sort_type', (req, res, next) => {
	req.session.sort_field = ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type  = ParamsHelpers.getParam(req.params, 'sort_type', 'asc');

	res.redirect(linkIndex);
});

module.exports = router;