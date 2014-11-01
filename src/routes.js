'use strict';

module.exports = function(modules) {
    var app = modules.app,
        config = modules.config,
        express = modules.express,
        helper = modules.helper,
        uuid = modules.uuid,
        io = modules.io,
        passport = require('passport'),
        PersonaStrategy = require('passport-persona').Strategy;

    function handleNotFound(req, res) {
        res.status(404);

        if (req.accepts('html')) {
            res.send(helper.render('app.notFound', {
                verb: req.method,
                url: req.url
            },
            req));
            return;
        }

        if (req.accepts('json')) {
            res.send({
                error: 'Not found'
            });
            return;
        }

        res.type('txt').send('Not found');
    }

    function handleForbidden(req, res) {
        res.status(403);

        if (req.accepts('html')) {
            res.send(helper.render('app.forbidden', {
                verb: req.method,
                url: req.url
            },
            req));
            return;
        }

        if (req.accepts('json')) {
            res.send({
                error: 'Forbidden'
            });
            return;
        }

        res.type('txt').send('Forbidden');
    }

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        handleForbidden(req, res);
    }

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user.email);
    });

    passport.deserializeUser(function(email, done) {
        done(null, { email: email });
    });

    // CSRF protection for PUT, POST, DELETE verbs...
    // see https://github.com/expressjs/csurf
    // app.use(function (err, req, res, next) {
    //     console.log('token = ' + req.csrfToken());
    //     console.log(req.body);
    //     console.log(err.code);
    //     if (err.code !== 'EBADCSRFTOKEN') {
    //         return next(err);
    //     }

    //     handleForbidden(req, res);
    // });

    passport.use(new PersonaStrategy({
        audience: config.audience
    },
    function(email, done) {
        process.nextTick(function () {
          // In a typical application, you would want
          // to associate the email address with a user record in your database, and
          // return that user instead.
          return done(null, {
            email: email
        });
      });
    }));

    app.post('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/auth',
        passport.authenticate('persona', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            res.redirect('/');
        }
    );

    app.post('/auth/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/', function (req, res) {
        console.log('is authed = ' + req.isAuthenticated());
        console.log('req user = ' + JSON.stringify(req.user));
        res.send(helper.render('home.default', {
            date: new Date().toLocaleTimeString(),
            username: 'foos',
            loggedUser: req.user
        },
        req));
    });

    app.post('/message', ensureAuthenticated, function(req, res) {
        var id = uuid.v4();

        if (req.body.message && req.body.message.length > 0) {
            io.sockets.emit('update', helper.render('home.story', {
                user: {
                    email: req.user.email
                },
                message: {
                    id: id,
                    body: req.body.message,
                }
            }));
        }

        res.send({
            ack: true
        });
    });

    app.use(express.static(__dirname + '/../dist'));
    app.use(express.static(__dirname + '/public', {
        extensions: 'html'
    }));

    app.use(handleNotFound);
};
