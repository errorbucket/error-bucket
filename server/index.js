var http = require('http');
var path = require('path');

var express = require('express');
var favicon = require('serve-favicon');
var compression = require('compression');

var ws = require('./websockets');
var serveStaticFile = require('./middleware-static-file');

var config = require('./config');

var app = express();
var server = http.createServer(app);

var publicPath = path.join(__dirname, '..', 'client/public');

app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(favicon(path.join(publicPath, 'favicon.ico')));
app.use(compression());
app.use('/static', express.static(publicPath));

// TODO: Remove.
app.get('/fake', serveStaticFile(path.join(publicPath, 'fake.html')));

app.use('/error', require('./module-logger'));
app.use('/', require('./module-router'));

ws.installHandlers(server, {prefix: '/ws'});

module.exports = server;
