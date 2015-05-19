var express = require('express');
var useragent = require('useragent');
var moment = require('moment');

var db = require('./database');
var ws = require('./websockets');
var router = express.Router();

var composeSHAFunc = require('./dbutils/compose-sha');
var getMessageSignature = require('./dbutils/message-signature');
var getBrowserSignature = composeSHAFunc(require('./dbutils/browser-name'));
var getPageSignature = composeSHAFunc(function(data) {
    return data.referer? data.referer.toString() : 'No referer';
});
var getScriptSignature = composeSHAFunc(function getTitleScript(data) {
    return data.url + ':' + (data.line || 0);
});

router.use(db.connect);
router.get('/', function(req, res, next) {
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
    doc.hash = {
        messageHash: getMessageSignature(doc),
        scriptHash: getScriptSignature(doc),
        pageHash: getPageSignature(doc),
        browserHash: getBrowserSignature(doc)
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
