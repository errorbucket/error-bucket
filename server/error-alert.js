var _ = require('lodash');
var exec = require('child_process').exec;
var moment = require('moment');
var fs = require('fs');
var path = require('path');

var db = require('./database');
var config = require('../config/config');
var template = fs.readFileSync(path.resolve('./server/template-alert.ejs'));

var TIME_INTERVAL = config.errorAlert.interval;
var THRESHOLD = config.errorAlert.threshold;
var recipient = config.errorAlert.recipient;

module.exports = function () {
    var NOW = Date.now();

    db.count({
        $and: [
            {timestamp: {$gte: NOW - TIME_INTERVAL*1000}}, //convert seconds to milliseconds
            {timestamp: {$lt: NOW}}
        ]
    }, function (err, count) {
        if (!err && count > THRESHOLD) {
            var timestamp = moment(NOW).format('YYYY-MM-DD HH:mm:SSS Z');
            var subject = "[ErrorTracker] Error Alert " + timestamp;
            var msg = (_.template(template))({
                thresh: THRESHOLD,
                timestamp: timestamp,
                count: count,
                url: config.baseurl,
                interval: TIME_INTERVAL
            });
            // mailx must be preinstalled on the server
            var cmd = 'echo "' + msg + '" | mail -s "' + subject + '" ' + recipient.join(' ');
            exec(cmd);
        }
    });
};
