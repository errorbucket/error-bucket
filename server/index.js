var http = require('http');
var path = require('path');

var express = require('express');
var favicon = require('serve-favicon');
var compression = require('compression');
var passport = require('passport');

var ws = require('./websockets');
var serveStaticFile = require('./middleware-static-file');
var redirectTo = require('./redirect-to');

require('../config/passport')(passport);

var app = express();
var server = http.createServer(app);

var publicPath = path.join(__dirname, '..', 'client/public');

app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(favicon(path.join(publicPath, 'favicon.ico')));
app.use(compression());
app.use('/static', express.static(publicPath));
app.get('/error', require('./module-logger'));

// TODO: Remove.
//app.get('/fake', serveStaticFile(path.join(publicPath, 'fake.html')));
app.get('/login', function(req, res, next) {
    if (req.isAuthenticated()) redirectTo('/');
    else next();
}, require('./route-login'));

app.get('/auth/google', passport.authenticate('google', { scope: 'profile' }));
app.get('/auth/callback/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.get('/reports/:type', isAuthenticated, require('./route-reports'));
app.get('/:type/:id?', isAuthenticated, require('./route-index'));
app.get('/', isAuthenticated, redirectTo('/messages/'));

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    else redirectTo('/login');
}

ws.installHandlers(server, {prefix: '/ws'});

module.exports = server;
