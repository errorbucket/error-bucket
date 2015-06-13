var express = require('express');
var useragent = require('useragent');
var isbot = require('is-bot');

var db = require('./database');
var ws = require('./websockets');
var router = express.Router();

var signatures = require('./signatures');

router.get('/', function(req, res, next) {

    var query = req.query;

    if (isbot(req.headers['user-agent']) || !query.message || !query.url) {
        return res.status(400).end();
    }

    var date = new Date();
    var ua = useragent.parse(req.headers['user-agent']).toJSON();
    var referer = query.page || req.headers.referer;

    var doc = {
        ua: ua,
        referer: referer,
        timestamp: date.valueOf(),
        createdAt: date,

        message: query.message,
        url: query.url,
        line: query.line,
        column: query.column,
        stack: query.stack
    };
    doc.hash = {
        messageHash: signatures.message(doc),
        scriptHash: signatures.script(doc),
        pageHash: signatures.page(doc),
        browserHash: signatures.browser(doc)
    };

    db.insert(doc, function(err) {
        if (err) {
            return res.status(500).end();
        }

        try {
            ws.broadcast(JSON.stringify(doc));
        } catch (e) {}

        res.end();
    });
});

module.exports = router;
