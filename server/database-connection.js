/**
 * Handle RethinkDB connection.
 *  1. Initialize the database at the beginning of the application
 *  2. Use `connect` and `close` middleware to establish connection
 *     NOTICE: Use `next` to pass the execution to `close` middleware
 *  3. Use the provided utility methods.
 */
var r = require('rethinkdb');
var config = require('./config');

var TABLE_NAME = 'logs';
var INDEX_NAME = 'timestamp';
var DATABASE_NAME = config.rethinkdb.db || 'test'; // `test` is the default database of rethinkdb

function connectDB(successCallback, errorHandler) {
    r.connect(config.rethinkdb)
        .then(successCallback)
        .error(errorHandler);
}

var dbConn = {
    /**
     * Name of the table used in the database to save logs
     */
    TABLE_NAME: TABLE_NAME,
    /**
     * Name of the indexed field
     */
    INDEX_NAME: INDEX_NAME,
    /**
     * Name of the database instance
     */
    DATABASE_NAME: DATABASE_NAME,
    /**
     * Initialize and setup the database from config file.
     *
     * If the database exists and is of the correct configuration (tables and indexes)
     * the existent database will be used. Otherwise, a new database will be automatically
     * created.
     *
     * `successCallback` will be called when a valid database instance either found or
     * created. The callback function takes no parameters. If a valid instance can neither
     * be found nor created, the function will dump the application with exit code of 1.
     *
     * @param successCallback
     */
    initialize: function(successCallback) {
        connectDB(function(conn) {
            r.table(dbConn.TABLE_NAME).indexWait(dbConn.INDEX_NAME).run(conn).then(function(){
                conn.close();
                successCallback();
            }).error(function() {
                console.log('Setting up database...');
                // The database/table/index was not available, create them
                r.dbCreate(dbConn.DATABASE_NAME).run(conn).then(function() {
                    return r.tableCreate(dbConn.TABLE_NAME).run(conn);
                }).then(function() {
                    return r.table(dbConn.TABLE_NAME).indexCreate(dbConn.INDEX_NAME).run(conn);
                }).then(function() {
                    return r.table(dbConn.TABLE_NAME).indexWait(dbConn.INDEX_NAME).run(conn);
                }).then(successCallback).error(function(err) {
                    console.log('Database Setup failed.\n' +
                        'This issue may be caused by the pre-existence of a wrongly configured instance of `%s`.\n' +
                        'Please try manually removing the instance in admin console.', dbConn.DATABASE_NAME);
                    console.log(err);
                    process.exit(1);
                }).finally(conn.close);
            });
        }, function(err) {
            console.log('Could not open a connection to initialize the database');
            console.log(err.message);
            process.exit(1);
        });
    },
    /**
     * Middleware for RethinkDB server connections
     * The connection instance will be preserved in `req`
     */
    connect: function(req, res, next) {
        connectDB(function(conn) {
            req._dbconn = conn;
            next();
        }, function(err) {
            return res.status(500).send(err.message);
        });
    },
    /**
     * Middleware for ending the RethinkDB server connections
     */
    close: function(req, res, next) {
        req._dbconn && req._dbconn.close();
        req._dbconn = undefined;
    },
    /**
     * Helper method for inserting documents into database
     * @param doc The document to be inserted
     * @param conn Connection instance
     * @param successCallback
     * @param errorHandler
     * @param finallyCallback (Optional)
     */
    insert: function(doc, conn, successCallback, errorHandler, finallyCallback) {
        var prom = r.table(dbConn.TABLE_NAME)
            .insert(doc)
            .run(conn)
            .then(successCallback)
            .error(errorHandler);
        finallyCallback && prom.finally(finallyCallback);
    }
};

module.exports = dbConn;
