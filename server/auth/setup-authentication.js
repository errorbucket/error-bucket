var _ = require('lodash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');

var config = require('../../config/config');

// additional rules to be applied after open authentication has returned
var additionalRules = require('./additional-validation-rules');
function composeRules(profile) {
    var rtn = true;
    _.forEach(additionalRules, function(n) {
        rtn = rtn && n(profile);
    });
    return rtn;
}

module.exports = function(app) {
    // if auth field of config.json is not configured or authentication is set not
    // to be used, no authentication will be performed
    if (!config.auth || config.auth.useAuth !== true) return false;

    // cookie key used to indicate logged in status
    // set the key in config.json.
    // NOTE: this key MUST match the key used in client/app.js
    var kLoggedIn = config.auth.sessionInfo.loggedInCookieName;

    app.use(cookieParser());
    app.use(session({
        secret: config.auth.sessionInfo.secret,
        resave: false,
        saveUninitialized: false,
        name: config.auth.sessionInfo.name
    }));

    var methods = config.auth.methods;
    _.forEach(methods, function(val, key) {
        try {
            // dynamic module loading, may lead to exceptions
            var authAdapter = require('./authentication-'+key)(val);
            if (!authAdapter) throw "no strategy";
            configurePassport(passport, authAdapter);
        } catch (e) { console.log(e); }
    });

    app.use(passport.initialize());
    app.use(passport.session());

    _.forEach(methods, function(val, key) {
        try {
            // dynamic module loading, may lead to exceptions
            var authAdapter = require('./authentication-'+key)(val);
            if (!authAdapter) throw "no strategy";

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
        return done(null, composeRules(profile));
    }));
}
