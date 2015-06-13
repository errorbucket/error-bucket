var aggregators = require('./aggregators');

module.exports = function (req, res, next) {
    var type = req.params.type;
    var aggregator = aggregators[type];

    if (aggregator) {
        aggregator(req.query, function(err, result) {
            if (err) {
                return res.status(500).end();
            }
            return res.json(result);
        });
    } else {
        return res.status(400).end();
    }
};
