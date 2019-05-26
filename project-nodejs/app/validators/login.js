const util  = require('util');
const notify= require(__path_configs + '/notify');

const options = {
    username: { min: 3, max: 10 },
    password: { min: 3, max: 10 },
    
}

const validator = (req) => {
    // username
    req.checkBody('username', util.format(notify.ERROR_NAME, options.username.min, options.username.max) )
        .isLength({ min: options.username.min, max: options.username.max })

    // password
    req.checkBody('password', util.format(notify.ERROR_NAME, options.password.min, options.password.max) )
        .isLength({ min: options.password.min, max: options.password.max })

    errors = req.validationErrors();
    if(!errors) errors = [];
    
    return errors;
};

module.exports = {
    validator
}