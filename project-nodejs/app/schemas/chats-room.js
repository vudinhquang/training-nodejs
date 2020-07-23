const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + '/database');

var schema = new mongoose.Schema({ 
    room: String,
    content: String,
    username: String,
    avatar: String,
    created: Date,
});

module.exports = mongoose.model(databaseConfig.col_chats_room, schema );