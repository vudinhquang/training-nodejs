const http = require('http');

const moduleOne = require('./libs');

http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello NodeJS\n');
}).listen(moduleOne.port);