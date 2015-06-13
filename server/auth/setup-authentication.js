var _ = require('lodash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

var config = require('../config');

// cookie key used to indicate logged in status
// set the key in config.json.
// NOTE: this key MUST match the key used in client/app.js
var kLoggedIn = 'error_bucket_logged_in';

module.exports = function (app) {
    if (!config.useAuth) return false;

    app.use(cookieParser());
    app.use(session({
        secret: 'error_bucket',
        resave: false,
        saveUninitialized: false,
        name: 'error_bucket.sid'
    }));
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    var methods = config.authMethods;
    var authAdapters = [];
    _.forEach(methods, function (val, key) {
        try {
            // dynamic module loading, may lead to exceptions
            var authAdapter = require('./authentication-' + key);
            authAdapters.push(authAdapter);
            passport.use(authAdapter.strategy);
        } catch (e) {
            console.log(e);
        }
    });

    app.use(passport.initialize());
    app.use(passport.session());

    _.forEach(authAdapters, function (adapter) {
        var authAdapter = adapter;

        var strategyName = authAdapter.strategyName,
            authenticationConfiguration = authAdapter.authenticationConfiguration;
        if (strategyName === 'local') {
            app.post('/auth/local', callbackAuthenticate('local'));
        } else {
            app.get('/auth/' + strategyName,
                passport.authenticate(strategyName, authenticationConfiguration));
            app.get('/auth/callback/' + strategyName, callbackAuthenticate(strategyName));
        }
    });

    app.get('/login/:error?', function (req, res, next) {
        if (req.isAuthenticated()) res.redirect('/');
        else next();
    }, require('../route-login'));
    app.get('/logout', function (req, res) {
        req.logout();
        res.clearCookie(kLoggedIn);
        res.redirect('/');
    });

    return true;
};

function callbackAuthenticate(strategyName) {
    return function (req, res, next) {
        passport.authenticate(strategyName, function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/login/error');
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                res.cookie(kLoggedIn, 'true');
                return res.redirect('/');
            });
        })(req, res, next);
    };
}
