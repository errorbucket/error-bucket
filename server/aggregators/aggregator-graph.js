var db = require('../database');

module.exports = function(conn, query, callback) {
    var match = {'timestamp': {
        $gte: Number(query.from),
        $lte: Number(query.to)
    }};
    query.message || (match['hash.messageHash'] = {$eq: query.message});

    db.aggregate(conn, [
        {$match: match},
        {$group: {
            //TODO: view refactor needed to display new graph
            _id: {$subtract: ['$timestamp', {$mod: ['$timestamp', Number(query.span)]}]},
            count: {$sum: 1}
        }},
        {$sort: {_id: 1}}
    ], callback);
};
