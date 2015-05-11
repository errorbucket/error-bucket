require('./server/require-jsx')();

var config = require('./server/config');
var server = require('./server');

if (config.useAlert) {
    var errorAlert = require('./server/error-alert');
    setInterval(errorAlert, config.errorAlert.interval * 1000);
    console.log('Email alert has been correctly configured and activated.');
}

if (config.useClearOutdated) {
    var span = config.clearOutdated.timespan * 1000;
    var freq = config.clearOutdated.frequency * 1000;
    var clearLogs = require('./server/clear-logs')(span);
    setInterval(clearLogs, freq);
    console.log('Only logs recorded in the past', span/1000, 'seconds will be preserved.');
}

server.listen(config.port);
console.log('Listening on port %s', config.port);

module.exports = server;
