var express = require('express');
var useragent = require('useragent');
var moment = require('moment');
var r = require('rethinkdb');

var dbConn = require('./database-connection');
var ws = require('./websockets');
var app = express();

app.use(dbConn.connect);
app.use(function(req, res, next) {
    var query = req.query;

    if (!query.message || !query.url) {
        return res.status(400).end();
    }

    var timestamp = Date.now();
    var date = moment(timestamp).format('DD-MM-YYYY');
    var ua = useragent.parse(req.headers['user-agent']).toJSON();
    var referer = query.page || req.headers.referer || "undefined";

    var doc = {
        ua: ua,
        referer: referer,
        timestamp: timestamp,
        date: date,

        message: query.message  || "undefined",
        url: query.url          || "undefined",
        line: query.line        || "undefined",
        column: query.column    || "undefined",
        stack: query.stack      || "undefined"
    };

    function errorHandler(err) {
        return res.status(500).send(err.message);
    }

    dbConn.insert(doc, req._dbconn, function(result) {
        if (result.inserted !== 1)
            return errorHandler(new Error("Log was not inserted."));
        try {
            //TODO: Is websocket necessary?
            ws.broadcast(JSON.stringify(doc));
        } catch(e) {}
        res.end();
    }, errorHandler, next);
});
app.use(dbConn.close);

module.exports = app;
