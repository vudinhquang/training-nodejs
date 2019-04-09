const mongoose       = require('mongoose');
const databaseConfig = require('../configs/database');

var schema = new mongoose.Schema({ 
    name: String, 
    status: String,
    ordering: Number 
});

module.exports = mongoose.model(databaseConfig.modelItem, schema);