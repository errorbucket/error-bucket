var _ = require('lodash');
var exec = require('child_process').exec;
var moment = require('moment');
var fs = require('fs');
var path = require('path');

var sampleTemplateFile = path.resolve('./config/template-alert.sample.ejs');
var templateFile = path.resolve('./config/template-alert.ejs');
var template;

try {
    template = fs.readFileSync(templateFile);
} catch (err) {
    template = fs.readFileSync(sampleTemplateFile);
    fs.writeFile(templateFile, template, function (err) {
        err && console.log(err);
    });
}

var db = require('./database');
var config = require('../config/config');
var messageAggregator = require('../common/aggregator-messages');
var pageAggregator = require('../common/aggregator-pages');

var TIME_INTERVAL = config.errorAlert.interval;
var THRESHOLD = config.errorAlert.threshold;
var recipient = config.errorAlert.recipient;

module.exports = function () {
    var NOW = Date.now();

    db.find({
        $and: [
            {timestamp: {$gte: NOW - TIME_INTERVAL*1000}}, //convert seconds to milliseconds
            {timestamp: {$lt: NOW}}
        ]
    }, function (err, docs) {
        if (!err && docs.length > THRESHOLD) {
            console.log('Too many exceptions occurred during the past', TIME_INTERVAL, 'seconds. Sending alert email...');
            var top10msgs = _.toArray(_.reduce(docs, messageAggregator({type: 'messages'}), {}))
                .sort(sortByCount).slice(0, 10);
            var top10pages = _.toArray(_.reduce(docs, pageAggregator({type: 'pages'}), {}))
                .sort(sortByCount).slice(0, 10);
            var timestamp = moment(NOW).format('YYYY-MM-DD HH:mm:SSS Z');
            var subject = "[ErrorTracker] Error Alert " + timestamp;
            var msg = (_.template(template))({
                thresh: THRESHOLD,
                timestamp: timestamp,
                count: docs.length,
                url: config.baseurl,
                interval: TIME_INTERVAL,
                messages: top10msgs,
                pages: top10pages
            });
            // mailx must be preinstalled on the server
            // the '-r' parameter is platform relevant. It cannot be used under OSX
            var cmd = 'echo "' + msg + '" | mail -r "ErrorTracker<et@baixing.com>" -s "' + subject + '" ' + recipient.join(' ');
            exec(cmd);
        }
    });
};

function sortByCount(a, b) {
    return b.count - a.count;
}
