var http = require('http');
var path = require('path');

var express = require('express');
var favicon = require('serve-favicon');
var compression = require('compression');

var ws = require('./websockets');
var serveStaticFile = require('./middleware-static-file');
var redirectTo = require('./redirect-to');
var setupAuthentication = require('./auth/setup-authentication');

var config = require('../config/config');

var app = express();
var server = http.createServer(app);

var publicPath = path.join(__dirname, '..', 'client/public');

app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(favicon(path.join(publicPath, 'favicon.ico')));
app.use(compression());
app.use('/static', express.static(publicPath));

// by default, no authentication will be enforced
var ensureAuthenticated = function(req, res, next) { return next(); };
if (setupAuthentication(app)) {
    ensureAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    }
}

// TODO: Remove.
app.get('/fake', serveStaticFile(path.join(publicPath, 'fake.html')));

app.get('/error', require('./module-logger'));

app.get('/reports/:type', ensureAuthenticated, require('./route-reports'));
app.get('/:type/:id?', ensureAuthenticated, require('./route-index'));
app.get('/', ensureAuthenticated, redirectTo('/messages/'));

ws.installHandlers(server, {prefix: '/ws'});

module.exports = server;
