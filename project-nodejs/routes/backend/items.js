var express = require('express');
var router = express.Router();

const systemConfig  = require('../../configs/system');
const ItemsModel    = require('../../schemas/items');
const ValidateItems = require('../../validators/items');
const UtilsHelpers  = require('../../helpers/utils');
const ParamsHelpers = require('../../helpers/params');
const linkIndex     = '/' + systemConfig.prefixAdmin + '/items';

const pageTitleIndex = 'Item Managment';
const pageTitleAdd = 'Item Managment - Add';
const pageTitleEdit = 'Item Managment - Edit';

// List items
router.get('(/status/:status)?', (req, res, next) => {
	let objWhere = {};
	let keyword = ParamsHelpers.getParam(req.query, 'keyword', '');
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'all');
	let statusFilter = UtilsHelpers.createFilterStatus(currentStatus);
	let pagination = {
		totalItems: 1,
		totalItemsPerPage: 5,
		currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', '1')),
		pageRanges: 3
	};

	if (currentStatus !== 'all') {
		if (keyword == '') {
			objWhere = { status: currentStatus };
		} else {
			objWhere = { status: currentStatus, name: new RegExp(keyword, 'i') };
		}
	} else {
		if (keyword !== '') {
			objWhere = { name: new RegExp(keyword, 'i') };
		}
	}

	ItemsModel.countDocuments(objWhere).then((data) => {
		pagination.totalItems = data;
		ItemsModel
			.find(objWhere)
			.sort({ ordering: 'asc' })
			.skip((pagination.currentPage - 1) * pagination.totalItemsPerPage)
			.limit(pagination.totalItemsPerPage)
			.then((items) => {
				res.render('pages/items/list', {
					pageTitle: 'Item List Page',
					items,
					statusFilter,
					pagination,
					currentStatus,
					keyword
				});
			});
	})
});

// Change status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');
	let id = ParamsHelpers.getParam(req.params, 'id', '');
	let status = (currentStatus === 'active') ? 'inactive' : 'active';
	ItemsModel.updateOne({ _id: id }, { status: status }, (err, result) => {
		req.flash('success', 'Cập nhật status thành công!', false);
		res.redirect(linkIndex);
	});
});

// Change status - Multi
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');
	ItemsModel.updateMany({ _id: { $in: req.body.cid } }, { status: currentStatus }, (err, result) => {
		req.flash('success', `Có ${result.n} phần tử được cập nhật thành công!`, false);
		res.redirect(linkIndex);
	});
});

// Change ordering - Multi
router.post('/change-ordering', function (req, res, next) {
	let cids = req.body.cid;
	let orderings = req.body.ordering;

	if (Array.isArray(cids)) {
		cids.forEach((item, index) => {
			ItemsModel.updateOne({ _id: item }, { ordering: parseInt(orderings[index]) }, (err) => { });
		})
	} else {
		ItemsModel.updateOne({ _id: cids }, { ordering: parseInt(orderings) }, (err) => { });
	}
	req.flash('success', 'Cập nhật ordering thành công!', false);
	res.redirect(linkIndex);
});

// Delete item
router.get('/delete/:id', (req, res, next) => {
	let id = ParamsHelpers.getParam(req.params, 'id', '');
	ItemsModel.deleteOne({ _id: id }, (err) => {
		req.flash('success', 'Xóa thành công!', false);
		res.redirect(linkIndex);
	});
});

// Delete - Multi
router.post('/delete', (req, res, next) => {
	ItemsModel.remove({ _id: { $in: req.body.cid } }, (err) => {
		req.flash('success', 'Xóa nhiều phần tử thành công!', false);
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
		res.render('pages/items/form', {
			pageTitle: pageTitleAdd,
			item,
			errors
		});
	} else {	//Edit
		ItemsModel.findById(id, (err, item) => {
			res.render('pages/items/form', {
				pageTitle: pageTitleEdit,
				item,
				errors
			});
		});
	}
});

// Add
router.post('/save', (req, res, next) => {
	let item   = Object.assign({}, req.body);
	let errors = ValidateItems.validator(req);

	if (errors) { // errors
		res.render('pages/items/form', {
			pageTitle: pageTitleAdd,
			item,
			errors
		});
	} else { // no errors		
		new ItemsModel(item)
		.save((err) => {
			req.flash('success', 'Thêm mới thành công!', false);
			res.redirect(linkIndex);
		});
	}
});

module.exports = router;