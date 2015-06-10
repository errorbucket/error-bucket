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
var aggregators = require('./aggregators');

var TIME_INTERVAL = config.errorAlert.interval;
var THRESHOLD = config.errorAlert.threshold;
var recipient = config.errorAlert.recipient;

module.exports = function () {
    var NOW = Date.now();

    db.direct_connect(function(err, conn) {
        if (err) return console.log(err);
        db.count(conn, {
            $and: [
                {timestamp: {$gte: NOW - TIME_INTERVAL*1000}}, //convert seconds to milliseconds
                {timestamp: {$lt: NOW}}
            ]
        }, function (err, count) {
            if (err) {
                console.error(err);
                conn.close();
            } else {
                console.log('Ranger Report: %s Errors @ %s ', count, NOW);
                if (count > THRESHOLD) {
                    console.log('Too many exceptions occurred during the past', TIME_INTERVAL, 'seconds. Sending alert email...');
                    var q = [
                        new Promise(function(res, rej) {
                            aggregators['messages'](conn, {}, function(err, msgs) {
                                if (err) return rej(err);
                                res(msgs.slice(0, 10));
                            });
                        }),
                        new Promise(function(res, rej) {
                            aggregators['pages'](conn, {}, function(err, pgs) {
                                if (err) return rej(err);
                                res(pgs.slice(0, 10));
                            });
                        })
                    ];
                    Promise.all(q).then(function(msgs, pgs) {
                        var timestamp = moment(NOW).format('YYYY-MM-DD HH:mm:SSS Z');
                        var msg = (_.template(template))({
                            thresh: THRESHOLD,
                            timestamp: timestamp,
                            count: count,
                            url: config.baseurl,
                            interval: TIME_INTERVAL,
                            messages: msgs,
                            pages: pgs
                        });
                        tmp.file(function(err, path) {
                            if (err) return;
                            fs.writeFile(path, msg, function(err) {
                                if (err) return;
                                // Postfix must be enabled and mutt must be installed
                                var subject = "[ErrorTracker] Error Alert " + timestamp;
                                var options = ['"html"', '"ErrorTracker<et@baixing.com>"', '"'+subject+'"', '"'+path+'"'];
                                var cmd = 'sh '+ sendMail + ' ' + options.join(' ') + ' ' + '"'+recipient.join('","')+'"';
                                exec(cmd, function(err) {
                                    if (err) console.log(err);
                                    else console.log('Alert sent.');
                                });
                            });
                        });
                        conn.close();
                    }).catch(function(err){
                        console.log(err);
                        conn.close();
                    });
                }
            }
        });
    });
};
