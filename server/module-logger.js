var express = require('express');
var useragent = require('useragent');

var db = require('./database');
var ws = require('./websockets');
var router = express.Router();

var signatures = require('./signatures');

router.use(db.connect);
router.get('/', function(req, res, next) {
    var query = req.query;

    if (!query.message || !query.url) {
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

    db.insert(req._db, doc, function(err) {
        if (err) {
            res.status(500).end();
            return next();
        }

        try {
            ws.broadcast(JSON.stringify(doc));
        } catch(e) {}

        res.end();
        next();
    });
});
router.use(db.close);

module.exports = router;
