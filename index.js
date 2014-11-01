'use strict';

var server = require('./src/server'),
    config = require('./config');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

server(config).start();
