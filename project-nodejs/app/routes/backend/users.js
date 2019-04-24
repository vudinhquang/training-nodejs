var express = require('express');
var router  = express.Router();
const util  = require('util');

const systemConfig  = require(__path_configs + '/system');
const notify        = require(__path_configs + '/notify');
const UsersModel    = require(__path_models + '/users');
const GroupsModel   = require(__path_models + '/groups');
const ValidateUsers = require(__path_validators + '/users');
const UtilsHelpers  = require(__path_helpers + '/utils');
const ParamsHelpers = require(__path_helpers + '/params');

const linkIndex      = '/' + systemConfig.prefixAdmin + '/users';
const pageTitleIndex = 'User Managment';
const pageTitleAdd   = pageTitleIndex + ' - Add';
const pageTitleEdit  = pageTitleIndex + ' - Edit';
const folderView     = __path_views + '/pages/users';

// List users
router.get('(/status/:status)?', async (req, res, next) => {
	let params	         = {};
	params.keyword 	     = ParamsHelpers.getParam(req.query, 'keyword', '');
	params.currentStatus = ParamsHelpers.getParam(req.params, 'status', 'all');
	params.sortField 	 = ParamsHelpers.getParam(req.session, 'sort_field', 'ordering');
	params.sortType 	 = ParamsHelpers.getParam(req.session, 'sort_type', 'asc');
	params.groupID 	     = ParamsHelpers.getParam(req.session, 'group_id', 'novalue');
	req.session.destroy();

	params.pagination = {
		totalItems: 1,
		totalItemsPerPage: 5,
		currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', '1')),
		pageRanges: 3
	};

	let groupsItems = [];
	let statusFilter  = await UtilsHelpers.createFilterStatus(params.currentStatus, 'users');
	
	await GroupsModel.listItemsInSelectbox(params).then((items)=> {
		groupsItems = items;
		groupsItems.unshift({_id: 'novalue', name: 'All group'});
	});

	await UsersModel.countItems(params).then( (data) => {
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
	
	UsersModel.changeStatus(id, currentStatus, {'task': 'update-one'}).then((result) => {
		req.flash('success', notify.CHANGE_STATUS_SUCCSESS, false);
		res.redirect(linkIndex);
	});
});

// Change status - Multi
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');
	
	UsersModel.changeStatus(req.body.cid, currentStatus, {'task': 'update-multi'}).then((result) => {
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCSESS, result.n), false);
		res.redirect(linkIndex);
	});
});

// Change ordering
router.post('/change-ordering', function (req, res, next) {
	let cids = req.body.cid;
	let orderings = req.body.ordering;

	UsersModel.changeOrdering(cids, orderings).then((result) => {
		req.flash('success', notify.CHANGE_ORDERING_SUCCESS, false);
		res.redirect(linkIndex);
	});
});

// Delete item
router.get('/delete/:id', (req, res, next) => {
	let id = ParamsHelpers.getParam(req.params, 'id', '');
	UsersModel.deleteItem(id, {'task': 'delete-one'}).then((result) => {
		req.flash('success', notify.DELETE_SUCCESS, false);
		res.redirect(linkIndex);
	});
});

// Delete - Multi
router.post('/delete', (req, res, next) => {
	UsersModel.deleteItem(req.body.cid, {'task': 'delete-multi'}).then((result) => {
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
		group_id: 'novalue',
		group_name: ''
	};
	let errors = null;
	let groupsItems = [];

	await GroupsModel.listItemsInSelectbox().then((items)=> {
		groupsItems = items;
		groupsItems.unshift({_id: 'novalue', name: 'All group'});
	});

	if (id === '') {	//Add
		res.render(folderView + '/form', {
			pageTitle: pageTitleAdd,
			item,
			errors,
			groupsItems
		});
	} else {	//Edit
		UsersModel.getItem(id).then((item) =>{
			item.group_id 	= item.group.id;
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
router.post('/save', async (req, res, next) => {
	let item = Object.assign({}, req.body);
	let errors = ValidateUsers.validator(req);
	let groupsItems = [];

	if(errors){
		await GroupsModel.listItemsInSelectbox().then((items)=> {
			groupsItems = items;
			groupsItems.unshift({_id: 'novalue', name: 'All group'});
		});
		res.render(folderView + '/form', {
			pageTitle: pageTitleEdit,
			item,
			errors,
			groupsItems
		});
	}else{
		if (item.id !== '') { // Edit
			UsersModel.saveItem(item, {'task': 'edit'}).then(() => {
				req.flash('success', notify.EDIT_SUCCESS, false);
				res.redirect(linkIndex);
			});
		}else{
			UsersModel.saveItem(item, {'task': 'add'}).then(() => {
				req.flash('success', notify.ADD_SUCCESS, false);
				res.redirect(linkIndex);
			});
		}
	}
});

// Sort
router.get('/sort/:sort_field/:sort_type', (req, res, next) => {
	req.session.sort_field = ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type  = ParamsHelpers.getParam(req.params, 'sort_type', 'asc');

	res.redirect(linkIndex);
});

// Filter Group
router.get('/filter-group/:group_id', (req, res, next) => {
	req.session.group_id = ParamsHelpers.getParam(req.params, 'group_id', 'novalue');

	res.redirect(linkIndex);
});

module.exports = router;