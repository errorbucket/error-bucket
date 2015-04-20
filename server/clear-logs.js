var _ = require('lodash');
var path = require('path');

var db = require('./database');

module.exports = function (span) {
    return function() {
        var since = Date.now() - span;

        db.remove({timestamp: {$lt: since}}, {multi: true}, function (err, count) {
            if (!err && count) {
                console.log(count, 'logs have been removed.');
            }
        });
        db.persistence.compactDatafile();
    }
};
