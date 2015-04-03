var express = require('express');
var useragent = require('useragent');
var moment = require('moment');

var db = require('./database');
var ws = require('./websockets');
var app = express();

app.use(function(req, res) {
    var query = req.query;

    if (!query.message || !query.url) {
        return res.status(400).end();
    }

    var timestamp = Date.now();
    var date = moment(timestamp).format('DD-MM-YYYY');
    var ua = useragent.parse(req.headers['user-agent']).toJSON();
    var referer = query.page || req.headers.referer;

    var doc = {
        ua: ua,
        referer: referer,
        timestamp: timestamp,
        date: date,

        message: query.message,
        url: query.url,
        line: query.line,
        column: query.column,
        stack: query.stack
    };

    db.insert(doc, function(err) {
        if (err) {
            return res.status(500).end();
        }

        try {
            ws.broadcast(JSON.stringify(doc));
        } catch(e) {}

        res.end();
    });
});

module.exports = app;
