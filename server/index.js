var http = require('http');
var path = require('path');

var express = require('express');
var favicon = require('serve-favicon');
var compression = require('compression');

var ws = require('./websockets');
var serveStaticFile = require('./middleware-static-file');
var redirectTo = require('./redirect-to');

var config = require('../config');

var app = express();
var ensureAuthenticated = require('./auth/ensure-authenticated')(app);
var server = http.createServer(app);

var publicPath = path.join(__dirname, '..', 'client/public');

app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(favicon(path.join(publicPath, 'favicon.ico')));
app.use(compression());
app.use('/static', express.static(publicPath));

// TODO: Remove.
app.get('/fake', serveStaticFile(path.join(publicPath, 'fake.html')));

app.get('/error', require('./module-logger'));

app.use(ensureAuthenticated);
app.get('/reports/:type', require('./route-reports'));
app.get('/:type/:id?', require('./route-index'));
app.get('/', redirectTo('/messages/'));

ws.installHandlers(server, {prefix: '/ws'});

module.exports = server;
