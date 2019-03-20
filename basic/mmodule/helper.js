const url = require('url');
const fs = require('fs');

function renderHTML(path, res){
    fs.readFile(path, (err, data) => {
        if (err) {
            // res.writeHead(404);
            res.write('File note found!');
        }else{
            res.write(data);
        }
        res.end();
    });
}

function render404(res){
    res.write('File note found!');
    res.end();
}

function onRequest(req, res){
    const path = url.parse(req.url).pathname;
    switch (path) {
        case '/':
            renderHTML('views/home.html', res);
            break;
        case '/about':
            renderHTML('views/about.html', res);
            break;
        default:
            render404(res);
            break;
    }
}

module.exports = {
    onRequest
};