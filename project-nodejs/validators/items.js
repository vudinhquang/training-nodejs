const notify = require('../configs/notify');
const util   = require('util');

const options = {
    name: { min: 5, max: 20 }
    , ordering: { min: 0, max: 100 }
    , status: { value: 'novalue' }
};

const isNotEqual = (req) => {
    if (req.body.status !== 'novalue') {
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
            return isNotEqual(req);
        });
    errors = req.validationErrors();
    return errors;
};

module.exports = {
    validator
}