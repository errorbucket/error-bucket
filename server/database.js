var client = require('mongodb').MongoClient;

var config = require('./config');
var url = config.db;

var COLLECTION_NAME = 'logs';

function connect(callback) {
    client.connect(url, callback);
}

var db = {
    /**
     * Name of the collection used in the database to store logs
     */
    COLLECTION_NAME: COLLECTION_NAME,
    /**
     * Initialize database
     * @param callback Node style callback `function(err, result)`
     */
    initialize: function(callback) {
        connect(function(err, db) {
            if (err) return callback(err, null);
            var promises = [];
            promises.push(new Promise(function (res, rej) {
                db.collection(COLLECTION_NAME)
                    .createIndex('timestamp', function (err) {
                        if (err) return rej(err);
                        res();
                    })
            }));
            config.logttl && promises.push(new Promise(function (res, rej) {
                db.collection(COLLECTION_NAME)
                    .createIndex('createdAt', {
                        expireAfterSeconds: config.logttl
                    }, function (err) {
                        if (err) return rej(err);
                        console.log('Set log TTL to %s seconds', config.logttl);
                        res();
                    })
            }));
            Promise.all(promises)
                .then(function() {callback(null);})
                .catch(function(err) {callback(err, null);});
        });
    },
    /**
     * Middleware for MongoDB server connections
     * The connection instance will be preserved in `req`
     */
    connect: function(req, res, next) {
        client.connect(url, function(err, db) {
            if (err) return res.status(500).end();
            req._db = db;
            next();
        });
    },
    /**
     * Middleware for ending the MongoDB server connections
     */
    close: function(req, res, next) {
        req._db && req._db.close();
        req._db = undefined;
    },
    /**
     * Helper method for inserting documents into database
     * @param db Connection instance
     * @param doc The document to be inserted
     * @param callback Node style callback `function(err, result)`
     */
    insert: function(db, doc, callback) {
        db.collection(COLLECTION_NAME).insertOne(doc, callback);
    },
    /**
     * Helper method for aggregate queries
     * @param db Connection instance
     * @param pipe Aggregation pipeline
     * @param callback Node style callback `function(err, result)`
     */
    aggregate: function(db, pipe, callback) {
        db.collection(COLLECTION_NAME).aggregate(pipe, callback);
    }
};

module.exports = db;
