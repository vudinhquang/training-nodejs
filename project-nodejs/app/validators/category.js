const notify = require(__path_configs + '/notify');
const util   = require('util');

const options = {
    name: { min: 3, max: 30 }
    , ordering: { min: 0, max: 20 }
    , status: { value: 'novalue' }
    , content: { min: 5, max: 200 }
    , slug: { min: 5, max: 50 }
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
    req.checkBody('content', util.format(notify.ERROR_NAME, options.content.min, options.content.max))
        .isLength({ min: options.content.min, max: options.content.max });
    req.checkBody('slug', util.format(notify.ERROR_NAME, options.slug.min, options.slug.max) )
        .isLength({ min: options.slug.min, max: options.slug.max })
    errors = req.validationErrors();
    return errors;
};

module.exports = {
    validator
}