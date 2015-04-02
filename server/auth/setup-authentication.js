var _ = require('lodash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');

var config = require('../../config/config');

module.exports = function(app) {
    if (!config.useAuth) return false;

    // cookie key used to indicate logged in status
    // set the key in config.json.
    // NOTE: this key MUST match the key used in client/app.js
    var kLoggedIn = 'error_board_logged_in';

    app.use(cookieParser());
    app.use(session({
        secret: 'error_board',
        resave: false,
        saveUninitialized: false,
        name: 'error_board.sid'
    }));

    var methods = config.authMethods;
    _.forEach(methods, function(val, key) {
        try {
            // dynamic module loading, may lead to exceptions
            var authAdapter = require('./authentication-'+key)(val, config.baseurl);
            configurePassport(passport, authAdapter);
        } catch (e) { console.log(e); }
    });

    app.use(passport.initialize());
    app.use(passport.session());

    _.forEach(methods, function(val, key) {
        try {
            // dynamic module loading, may lead to exceptions
            var authAdapter = require('./authentication-'+key)(val, config.baseurl);

            var strategyName = authAdapter.strategyName,
                authenticationConfiguration = authAdapter.authenticationConfiguration;
            app.get('/auth/'+strategyName,
                passport.authenticate(strategyName, authenticationConfiguration));
            app.get('/auth/callback/'+strategyName, function(req, res, next) {
                passport.authenticate(strategyName, function(err, user) {
                    if (err) { return next(err); }
                    if (!user) { return res.redirect('/login/error'); }
                    req.logIn(user, function(err) {
                        if (err) { return next(err); }
                        res.cookie(kLoggedIn, 'true');
                        return res.redirect('/');
                    });
                })(req, res, next);
            });
        } catch (e) { console.log(e); }
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

function configurePassport(passportObj, authAdapter) {
    passportObj.serializeUser(function(user, done) {
        done(null, user);
    });
    passportObj.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passportObj.use(new authAdapter.strategy(
        authAdapter.strategyConfiguration, function(token, refreshToken, profile, done) {
        return done(null, (function(profile) {
            if (!config.auth.emailpattern) return true;
            if (_.isArray(config.auth.emailpattern)) {
                return validateEmailWithSuffixArray(profile, config.auth.emailpattern);
            } else {
                return validateEmailWithPattern(profile, config.auth.emailpattern);
            }
        })(profile));
    }));
}

function validateEmailWithSuffixArray (profile, array) {
    var valid = false;
    profile.emails && _.forEach(profile.emails, function(n) {
        try {
            var suffix = /^.+@(.+)$/.exec(n.value)[1];
            valid = valid || (n.value && _.contains(array, suffix));
        } catch (e) {console.log(e);}
    });
    return valid;
}

function validateEmailWithPattern (profile, pattern) {
    var valid = false;
    var re = new RegExp(pattern);
    profile.emails && _.forEach(profile.emails, function(n) {
        valid = valid || (n.value && re.test(n.value));
    });
    return valid;
}
