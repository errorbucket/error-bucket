var _ = require('lodash');
var path = require('path');
var fs = require('fs-extra');
var moment = require('moment');

var config = require('./config');
var db = require('./database');

var dbpath = path.join(__dirname, '..', config.dbfile);

module.exports = function (span) {
    return function() {
        var since = Date.now() - span;
        var suffix = '.' + moment().format('YYYYMMDDHHmmss');

        fs.copy(dbpath, dbpath+suffix, function(err) {
            if (err) return;
            db.remove({timestamp: {$lt: since}}, {multi: true}, function (err, count) {
                if (!err && count) {
                    console.log(count + ' logs have been removed.');
                    db.persistence.compactDatafile();
                }
            });
        });
    }
};
