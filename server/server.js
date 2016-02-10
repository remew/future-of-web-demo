'use strict';

let config = require('./config');
let BrowsentationServer = require('./BrowsentationServer');

let bs = new BrowsentationServer(config.port, config.admin.username, config.admin.password);

console.log(`Starting Browsentation on port:${config.port}`);
bs.start(config.auth);

