var db = require('../database');

module.exports = function(conn, query, callback) {
    db.aggregate(conn, [
        {$group: {
            _id: '$hash.messageHash',
            count: {$sum: 1},
            browsers: {$addToSet: '$ua.family'},
            title: {$first: '$message'},
            earliest: {$min: '$timestamp'},
            latest: {$max: '$timestamp'},
            id: {$first: '$hash.messageHash'}
        }},
        {$sort: {count: -1}},
        {$limit: 100}
    ], callback);
};
