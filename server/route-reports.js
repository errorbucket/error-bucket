var _ = require('lodash');

var db = require('./database');
var aggregators = require('../common/aggregators');

module.exports = function(req, res) {
    var type = req.params.type;
    var aggregator = aggregators[type];

    if (aggregator) {
        db.find({}, function(err, docs) {
            if (err) {
                res.status(400).json({ error: err });
            } else {
                res.json(_.reduce(docs, aggregator(req.query), {}));
            }
        });
    } else {
        res.status(400).end();
    }
};
