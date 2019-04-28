const notify = require(__path_configs + '/notify');
const util   = require('util');

const options = {
    name: { min: 5, max: 20 }
    , ordering: { min: 0, max: 100 }
    // , status: { value: 'novalue' }
    // , group_id: { value: 'novalue' }
    , selectEle: { value: 'novalue' }
    , content: { min: 5, max: 200 }
};

const isNotEqual = (req, ele) => {
    if (req.body[ele] !== options.selectEle.value) {
        return true;
    } else {
        return false;
    }
}

const validator = (req, errUpload, task) => {
    let errors = false;
    req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max))
        .isLength({ min: options.name.min, max: options.name.max });
    req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
        .isInt({ gt: options.ordering.min, lt: options.ordering.max });
    // req.checkBody('status', 'Phải chọn status').isNotEqual('novalue');
    req.checkBody('status', notify.ERROR_STATUS)
        .custom(() => {
            return isNotEqual(req, 'status');
        });
    req.checkBody('group_id', notify.ERROR_GROUP)
        .custom(() => {
        return isNotEqual(req, 'group_id');
    });
    req.checkBody('content', util.format(notify.ERROR_NAME, options.content.min, options.content.max))
        .isLength({ min: options.content.min, max: options.content.max });
    errors = req.validationErrors();

    if (errUpload) {
        if (errUpload.code === 'LIMIT_FILE_SIZE') {
            errors.push({ 'param': 'avatar', 'msg': notify.ERROR_FILE_LIMIT });
        }

        if (errUpload.extname) {
            errors.push({ 'param': 'avatar', 'msg': errUpload.extname });
        }
    } else {
        if (!req.file && task === 'add') {
            errors.push({ 'param': 'avatar', 'msg': notify.ERROR_FILE_REQUIRE });
        }
    }
    
    return errors;
};

module.exports = {
    validator
}