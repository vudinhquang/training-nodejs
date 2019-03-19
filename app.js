const http = require('http');
const fs = require('fs');
const url = require('url');

const configs = require('./mmodule/config');

function onRequest(req, res){
    const path = url.parse(req.url).pathname;
    console.log(path);

    if (path == '/about') {
        fs.readFile('views/about.html', (err, data) => {
            if (err) {
                // res.writeHead(404);
                res.write('File note found!');
            }else{
                res.write(data);
            }
            res.end();
        });
    } else if(path == '/'){
        fs.readFile('views/home.html', (err, data) => {
            if (err) {
                // res.writeHead(404);
                res.write('File note found!');
            }else{
                res.write(data);
            }
            res.end();
        });
    }
}

http.createServer(onRequest).listen(configs.port);