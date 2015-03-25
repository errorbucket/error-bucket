var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');

var express = require('express');
var session = require('express-session');
var favicon = require('serve-favicon');
var compression = require('compression');

var ws = require('./websockets');
var serveStaticFile = require('./middleware-static-file');
var redirectTo = require('./redirect-to');

var app = express();
var server = http.createServer(app);

var publicPath = path.join(__dirname, '..', 'client/public');

app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(favicon(path.join(publicPath, 'favicon.ico')));
app.use(compression());
app.use('/static', express.static(publicPath));

var config = require('../config/config.js');
// if auth field of config.json is not configured, no authentication will be performed
if (config.auth) {
    var kLoggedIn = 'baixing_error_tracker_loggedin';

    app.use(cookieParser());
    app.use(session({
        secret: 'baixing_error_tracker',
        resave: false,
        saveUninitialized: false,
        name: 'baixing_error_tracker.sid'
    }));

    var passport = require('passport');
    require('../config/passport')(passport, 'googleOAuth2');
    app.use(passport.initialize());
    app.use(passport.session());
    app.get('/login/:error?', function (req, res, next) {
        if (req.isAuthenticated()) res.redirect('/');
        else next();
    }, require('./route-login'));
    app.get('/logout', function (req, res) {
        req.logout();
        res.clearCookie(kLoggedIn);
        res.redirect('/');
    });

    // Google specific configuration
    app.get('/auth/google', passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/userinfo.email'}));
    //app.get('/auth/callback/google', passport.authenticate('google', {
    //    successRedirect: '/',
    //    failureRedirect: '/login/error'
    //}));
    app.get('/auth/callback/google', function(req, res, next) {
        passport.authenticate('google', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login/error'); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                res.cookie(kLoggedIn, 'true');
                return res.redirect('/');
            });
        })(req, res, next);
    });
}

// TODO: Remove.
app.get('/fake', serveStaticFile(path.join(publicPath, 'fake.html')));

app.get('/error', require('./module-logger'));

app.get('/reports/:type', isAuthenticated, require('./route-reports'));
app.get('/:type/:id?', isAuthenticated, require('./route-index'));
app.get('/', isAuthenticated, redirectTo('/messages/'));

function isAuthenticated(req, res, next) {
    // if auth field is not configured in the config.json, no authentication will be performed
    if (!config.auth || req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/login/');
    }
}

ws.installHandlers(server, {prefix: '/ws'});

module.exports = server;
