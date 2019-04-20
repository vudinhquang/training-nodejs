const notify = require(__path_configs + '/notify');
const util   = require('util');

const options = {
    name: { min: 5, max: 20 }
    , ordering: { min: 0, max: 100 }
    , status: { value: 'novalue' }
    , group: { value: 'novalue' }
    , content: { min: 5, max: 200 }
};

const isNotEqual = (req, ele) => {
    if (req.body[ele] !== 'novalue') {
        return true;
    } else {
        return false;
    }
}

const validator = (req) => {
    let errors = false;
    req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max))
        .isLength({ min: options.name.min, max: options.name.max });
    req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
        .isInt({ gt: options.ordering.min, lt: options.ordering.max });
    // req.checkBody('status', 'Phải chọn status').isNotEqual('novalue');
    req.checkBody('status', notify.ERROR_STATUS)
        .custom(() => {
            return isNotEqual(req), 'status';
        });
    req.checkBody('group', notify.ERROR_GROUP)
        .custom(() => {
        return isNotEqual(req, 'group');
    });
    req.checkBody('content', util.format(notify.ERROR_NAME, options.content.min, options.content.max))
        .isLength({ min: options.content.min, max: options.content.max });
    errors = req.validationErrors();
    
    return errors;
};

module.exports = {
    validator
}