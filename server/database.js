var client = require('mongodb').MongoClient;

var url = require('./config').db;

var COLLECTION_NAME = 'logs';

var db = {
    /**
     * Name of the collection used in the database to store logs
     */
    COLLECTION_NAME: COLLECTION_NAME,
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
        db.collection(this.COLLECTION_NAME).insertOne(doc, callback);
    },
    /**
     * Helper method for aggregate queries
     * @param db Connection instance
     * @param pipe Aggregation pipeline
     * @param callback Node style callback `function(err, result)`
     */
    aggregate: function(db, pipe, callback) {
        db.collection(this.COLLECTION_NAME).aggregate(pipe, callback);
    }
};

module.exports = db;
