const mongoose = require('mongoose');
var schema = new mongoose.Schema({ 
    name: 'string', 
    status: 'string',
    ordering: 'string' 
});

module.exports = mongoose.model('Item', schema);