var aggregators = require('./dbutils/aggregators');

module.exports = function (req, res, next) {
    var type = req.params.type;
    var aggregator = aggregators[type];

    if (aggregator) {
        aggregator(req._db, req.query, function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).end();
                return next();
            }
            console.log(result);
            res.json(result);
            next();
        });
    } else {
        res.status(400).end();
        next();
    }
};
