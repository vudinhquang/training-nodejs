var express = require('express');
var router = express.Router();
const util = require('util');

const systemConfig  = require(__path_configs + '/system');
const notify  		= require(__path_configs + '/notify');
const ItemsModel    = require(__path_schemas + '/items');
const ValidateItems = require(__path_validators +'/items');
const UtilsHelpers  = require(__path_helpers + '/utils');
const ParamsHelpers = require(__path_helpers + '/params');

const linkIndex     = '/' + systemConfig.prefixAdmin + '/items';
const pageTitleIndex = 'Item Managment';
const pageTitleAdd   = 'Item Managment - Add';
const pageTitleEdit  = 'Item Managment - Edit';
const folderView	 =  __path_views + '/pages/items';

// List items
router.get('(/status/:status)?', async (req, res, next) => {
	let objWhere      = {};
	let keyword       = ParamsHelpers.getParam(req.query, 'keyword', '');
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'all');
	let statusFilter  = await UtilsHelpers.createFilterStatus(currentStatus);
	let pagination    = {
		totalItems: 1,
		totalItemsPerPage: 5,
		currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', '1')),
		pageRanges: 3
	};

	if(currentStatus !== 'all') objWhere.status	= currentStatus;
	if(keyword !== '') objWhere.name = new RegExp(keyword, 'i');

	await ItemsModel.countDocuments(objWhere).then((data) => {
		pagination.totalItems = data;
	});

	ItemsModel
	.find(objWhere)
	.sort({ ordering: 'asc' })
	.skip((pagination.currentPage - 1) * pagination.totalItemsPerPage)
	.limit(pagination.totalItemsPerPage)
	.then((items) => {
		res.render(folderView + '/list', {
			pageTitle: 'Item List Page',
			items,
			statusFilter,
			pagination,
			currentStatus,
			keyword
		});
	});
});

// Change status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');
	let id = ParamsHelpers.getParam(req.params, 'id', '');
	let status = (currentStatus === 'active') ? 'inactive' : 'active';
	ItemsModel.updateOne({ _id: id }, { status: status }, (err, result) => {
		req.flash('success', notify.CHANGE_STATUS_SUCCSESS, false);
		res.redirect(linkIndex);
	});
});

// Change status - Multi
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');
	ItemsModel.updateMany({ _id: { $in: req.body.cid } }, { status: currentStatus }, (err, result) => {
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCSESS, result.n), false);
		res.redirect(linkIndex);
	});
});

// Change ordering
router.post('/change-ordering', function (req, res, next) {
	let cids = req.body.cid;
	let orderings = req.body.ordering;

	if (Array.isArray(cids)) { // Change ordering - Multi
		cids.forEach((item, index) => {
			ItemsModel.updateOne({ _id: item }, { ordering: parseInt(orderings[index]) }, (err) => { });
		})
	} else { // Change ordering - One
		ItemsModel.updateOne({ _id: cids }, { ordering: parseInt(orderings) }, (err) => { });
	}
	req.flash('success', notify.CHANGE_ORDERING_SUCCESS, false);
	res.redirect(linkIndex);
});

// Delete item
router.get('/delete/:id', (req, res, next) => {
	let id = ParamsHelpers.getParam(req.params, 'id', '');
	ItemsModel.deleteOne({ _id: id }, (err) => {
		req.flash('success', notify.DELETE_SUCCESS, false);
		res.redirect(linkIndex);
	});
});

// Delete - Multi
router.post('/delete', (req, res, next) => {
	ItemsModel.remove({ _id: { $in: req.body.cid } }, (err, result) => {
		req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, result.n), false);
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
		ItemsModel.findById(id, (err, item) => {
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
	let item   = Object.assign({}, req.body);
	let errors = ValidateItems.validator(req);

	if (item.id !== '') { // Edit
		if (errors) { // errors
			res.render(folderView + '/form', {
				pageTitle: pageTitleEdit,
				item,
				errors
			});
		} else { // no errors		
			ItemsModel.updateOne({ _id: item.id }, { 
				name: item.name
				, ordering: parseInt(item.ordering) 
				, status: item.status
			}, (err) => { 
				req.flash('success', notify.EDIT_SUCCESS, false);
				res.redirect(linkIndex);
			});
		}
	} else { // Add
		if (errors) { // errors
			res.render(folderView + '/form', {
				pageTitle: pageTitleAdd,
				item,
				errors
			});
		} else { // no errors		
			new ItemsModel(item)
			.save((err) => {
				req.flash('success', notify.ADD_SUCCESS, false);
				res.redirect(linkIndex);
			});
		}
	}
});

module.exports = router;