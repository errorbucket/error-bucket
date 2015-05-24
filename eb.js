require('./server/require-jsx')();
var db = require('./server/database');

var config = require('./server/config');
var server = require('./server');

db.initialize(function(err) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    if (config.useAlert) {
        var errorAlert = require('./server/error-alert');
        setInterval(errorAlert, config.errorAlert.interval * 1000);
        console.log('Email alert has been correctly configured and activated.');
    }

    server.listen(config.port);
    console.log('Listening on port %s', config.port);
});


module.exports = server;
