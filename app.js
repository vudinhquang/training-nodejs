const http = require('http');
const fs = require('fs');

const configs = require('./mmodule/config');

function onRequest(req, res){
    fs.readFile('./home.html', (err, data) => {
        if (err) {
            // res.writeHead(404);
            res.write('File note found!');
        }else{
            res.write(data);
        }
        res.end();
    });
}

http.createServer(onRequest).listen(configs.port);