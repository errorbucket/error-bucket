var db = require('../database');

module.exports = function(conn, query, callback) {
    db.aggregate(conn, [
        {$match: {'hash.scriptHash': {$eq: query.id}}},
        {$group: {
            _id: '$hash.messageHash',
            title: {$first: '$message'},
            count: {$sum: 1},
            earliest: {$min: '$timestamp'},
            latest: {$max: '$timestamp'},
            browsers: {$addToSet: '$ua.family'}
        }},
        {$sort: {count: -1}}
    ], callback);
};
