const http = require('http');

const configs = require('./mmodule/config');
const helpers = require('./mmodule/helper');

http.createServer(helpers.onRequest).listen(configs.port);