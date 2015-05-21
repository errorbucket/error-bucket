var _ = require('lodash');
var exec = require('child_process').exec;
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var tmp = require('tmp');

var sampleTemplateFile = path.resolve('./config/template-alert.sample.ejs');
var templateFile = path.resolve('./config/template-alert.ejs');
var sendMail = path.resolve('./send_mail.sh');
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
var config = require('./config');
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
        if (err) {
            console.error(err);
        } else {
            console.log('Ranger Report: %s Errors @ %s ', docs.length, NOW);
            if (docs.length > THRESHOLD) {
                console.log('Too many exceptions occurred during the past', TIME_INTERVAL, 'seconds. Sending alert email...');
                var top10msgs = _.toArray(_.reduce(docs, messageAggregator({type: 'messages'}), {}))
                    .sort(sortByCount).slice(0, 10);
                var top10pages = _.toArray(_.reduce(docs, pageAggregator({type: 'pages'}), {}))
                    .sort(sortByCount).slice(0, 10);
                var timestamp = moment(NOW).format('YYYY-MM-DD HH:mm:SSS Z');
                var msg = (_.template(template))({
                    thresh: THRESHOLD,
                    timestamp: timestamp,
                    count: docs.length,
                    url: config.baseurl,
                    interval: TIME_INTERVAL,
                    messages: top10msgs,
                    pages: top10pages
                });
                tmp.file(function(err, path) {
                    if (err) return;
                    fs.writeFile(path, msg, function(err) {
                        // Postfix must be enabled and mutt must be installed
                        var subject = "[ErrorTracker] Error Alert " + timestamp;
                        var options = ['"html"', '"ErrorTracker<et@baixing.com>"', '"'+subject+'"', '"'+path+'"']
                        var cmd = 'sh '+ sendMail + ' ' + options.join(' ') + ' ' + '"'+recipient.join('","')+'"';
                        exec(cmd, function(err){
                            if (err) console.log(err);
                            else console.log('Alert sent.');
                        });
                    });
                });
            }
        }
    });
};

function sortByCount(a, b) {
    return b.count - a.count;
}
