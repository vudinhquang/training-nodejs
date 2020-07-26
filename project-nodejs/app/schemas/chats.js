const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + '/database');

var schema = new mongoose.Schema({ 
    content: String,
    username: String,
    avatar: String,
    // user: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: databaseConfig.col_users 
    // },
    created: Date
});

module.exports = mongoose.model(databaseConfig.col_chats, schema );

// username avatar
// userid
// username