var express = require('express');
var router = express.Router();

const folderView    = __path_views_chat + '/pages/invitation/';
const layoutChat    = __path_views_chat + '/main';

router.get('/receive', async (req, res, next) => {
    res.render(`${folderView}receive`, {
        layout: layoutChat
    });
});

module.exports = router;


