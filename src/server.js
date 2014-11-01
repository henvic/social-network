'use strict';

module.exports = function(config) {
    var path = require('path'),
        express = require('express'),
        bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser'),
        //csrf = require('csurf'),
        socketIo = require('socket.io'),
        session = require('cookie-session'),
        soynode = require('soynode'),
        http = require('http'),
        uuid = require('node-uuid'),
        routes = require('./routes'),
        helper,
        port = process.env.PORT || 8000;

    helper = require('./lib/helper')({
        soynode: soynode
    });

    function startServer() {
        var app = express(),
            server = http.Server(app),
            io = socketIo(server);

        server.listen(port, function() {
            console.info('[%s] Listening on http://localhost:%d',
                app.settings.env,
                port);

            app.use(cookieParser());
            app.use(session({keys: ['not-really-secret-app-key']}));
            //app.use(csrf());
            app.use(bodyParser.urlencoded({extended: false}));
            app.use(bodyParser.json());

            routes({
                express: express,
                app: app,
                soynode: soynode,
                io: io,
                uuid: uuid,
                helper: helper,
                config: config
            });
        });
    }

    function prepare(done) {
        if (/^win/.test(process.platform)) {
            console.warn('Using Windows for web development is not cool.');
        }

        soynode.setOptions({
            inputDir: path.resolve(__dirname + '/views'),
            outputDir: path.resolve(__dirname + '/../dist/templates'),
            allowDynamicRecompile: true,
            eraseTemporaryFiles: true
        });

        soynode.compileTemplates(__dirname, function (err) {
            if (err) {
                throw err;
            }

            console.log('Templates compiled.');
            done();
        });
    }

    exports.start = function start() {
        prepare(function() {
            startServer();
        });
    };

    return exports;
};
