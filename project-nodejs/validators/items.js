const isNotEqual = (req) => {
    if (req.body.status !== 'novalue') {
        return true;
    } else {
        return false;
    }
}

const validator = (req) => {
    let errors = false;
    req.checkBody('name', 'Chiều dài từ 5 đến 20 ký tự').isLength({ min: 5, max: 20 });
    req.checkBody('ordering', 'Phải là số nguyên lớn hơn 0 và bé hơn 100').isInt({ gt: 0, lt: 100 });
    // req.checkBody('status', 'Phải chọn status').isNotEqual('novalue');
    req.checkBody('status', 'Phải chọn status').custom(() => {
        return isNotEqual(req);
    });
    errors = req.validationErrors();
    return errors;
};

module.exports = {
    validator
}