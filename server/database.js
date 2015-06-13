var client = require('mongodb').MongoClient;

var config = require('./config');
var url = config.db;

var COLLECTION_NAME = 'logs';

var _instance = null;

var utils = {
    /**
     * Name of the collection used in the database to store logs
     */
    COLLECTION_NAME: COLLECTION_NAME,
    /**
     * Initialize database
     * @param callback Node style callback `function(err, result)`
     */
    initialize: function(callback) {
        client.connect(url, function(err, db) {
            if (err) return callback(err, null);
            var promises = [];
            var collection = db.collection(COLLECTION_NAME);
            promises.push(new Promise(function (res, rej) {
                collection
                    .createIndex('timestamp', function (err) {
                        if (err) return rej(err);
                        res();
                    });
            }));
            config.logttl && promises.push(new Promise(function (res, rej) {
                function createTTLIndex(callback) {
                    collection.createIndex('createdAt', {
                        expireAfterSeconds: config.logttl
                    }, callback);
                }
                createTTLIndex(function (err) {
                    console.log('Set log TTL to %s seconds...', config.logttl);
                    if (err && err.code == 85) { // `createdAt_idx` exists but with different options
                        console.log('Detected previously created TTL index with different options. Dropping...')
                        return collection.dropIndex('createdAt_1', function(e) {
                            if (e) return rej(e);
                            console.log('Recreating TTL index...');
                            createTTLIndex(function (err) {
                                if (err) return rej(err);
                                console.log('TTL index successfully recreated.');
                                res();
                            });
                        });
                    } else if (err) {
                        return rej(err);
                    }
                    res();
                });
            }));
            Promise.all(promises)
                .then(function() {
                    _instance = db; // save the connection instance for connection pool
                    callback(null);
                })
                .catch(function(err) {callback(err, null);});
        });
    },
    /**
     * Helper method for inserting documents into database
     * @param db Connection instance
     * @param doc The document to be inserted
     * @param callback Node style callback `function(err, result)`
     */
    insert: function(doc, callback) {
        _instance.collection(COLLECTION_NAME).insertOne(doc, callback);
    },
    /**
     * Helper method for aggregate queries
     * @param db Connection instance
     * @param pipe Aggregation pipeline
     * @param callback Node style callback `function(err, result)`
     */
    aggregate: function(pipe, callback) {
        _instance.collection(COLLECTION_NAME).aggregate(pipe, callback);
    },
    /**
     * Helper method for count
     * @param db
     * @param query
     * @param callback
     */
    count: function(db, query, callback) {
        _instance.collection(COLLECTION_NAME).count(query, {hint: 'timestamp'}, callback);
    }
};

module.exports = utils;
