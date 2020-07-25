var express = require('express');
var router = express.Router();

const folderView    = __path_views_chat + '/pages/friends/';
const layoutChat    = __path_views_chat + '/main';


router.get('/', async (req, res, next) => {
    res.render(`${folderView}index`, {
        layout: layoutChat
    });
});

module.exports = router;
