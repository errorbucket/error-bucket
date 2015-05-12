require('./server/require-jsx')();

var r = require('rethinkdb');

var config = require('./server/config');
var server = require('./server');

var TABLE_NAME = 'logs';
var INDEX_NAME = 'timestamp';

/*
 * Create tables/indexes then start express
 */
r.connect(config.rethinkdb, function(err, conn) {
    if (err) {
        console.log('Could not open a connection to initialize the database');
        console.log(err.message);
        process.exit(1);
    }

    r.table(TABLE_NAME).indexWait(INDEX_NAME).run(conn).then(function(){
        conn.close();
        start();
    }).error(function() {
        console.log('Setting up database...');
        // The database/table/index was not available, create them
        r.dbCreate(config.rethinkdb.db).run(conn).then(function() {
            return r.tableCreate(TABLE_NAME).run(conn);
        }).then(function() {
            return r.table(TABLE_NAME).indexCreate(INDEX_NAME).run(conn);
        }).then(function() {
            return r.table(TABLE_NAME).indexWait(INDEX_NAME).run(conn);
        }).then(start).error(function(err) {
            console.log('Database Setup failed.\n' +
                'This issue may be caused by the pre-existence of a wrongly configured instance of `%s`.\n' +
                'Please try manually removing the instance in admin console.', config.rethinkdb.db);
            console.log(err);
            process.exit(1);
        }).finally(conn.close);
    });
});

function start() {
    console.log('Table and index are available, starting...');

    // Email alert
    if (config.useAlert) {
        var errorAlert = require('./server/error-alert');
        setInterval(errorAlert, config.errorAlert.interval * 1000);
        console.log('Email alert has been correctly configured and activated.');
    }

    // Clear outdated
    if (config.useClearOutdated) {
        var span = config.clearOutdated.timespan * 1000;
        var freq = config.clearOutdated.frequency * 1000;
        var clearLogs = require('./server/clear-logs')(span);
        setInterval(clearLogs, freq);
        console.log('Only logs recorded in the past', span/1000, 'seconds will be preserved.');
    }

    server.listen(config.port);
    console.log('Listening on port %s', config.port);
}

module.exports = server;
