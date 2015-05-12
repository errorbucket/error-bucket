// Middleware for RethinkDB server connections
// The connection instance will be preserved in `req`

var r = require('rethinkdb');
var config = require('./config');

module.exports = {
    connect: function(req, res, next) {
        r.connect(config.rethinkdb).then(function(conn) {
            req._dbconn = conn;
            next();
        }).error(function(err) {
            return res.status(500).send(err.message);
        });
    },
    close: function(req, res, next) {
        req._dbconn && req._dbconn.close();
    }
};
