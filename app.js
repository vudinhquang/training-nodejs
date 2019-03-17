const http = require('http');

const moduleConfig = require('./mmodule/config');

http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Hello NodeJS</h1>');
}).listen(moduleConfig.port);