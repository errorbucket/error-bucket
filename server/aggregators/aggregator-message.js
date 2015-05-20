var db = require('../database');

module.exports = function(conn, query, callback) {
    db.aggregate(conn, [
        {$match: {'hash.messageHash': {$eq: query.id}}},
        {$group: {
            _id: '$hash.browserHash',
            id: {$first: '$hash.browserHash'},
            count: {$sum: 1},
            stack: {$first: '$stack'},
            line: {$first: '$line'},
            url: {$first: '$url'},
            earliest: {$min: '$timestamp'},
            latest: {$max: '$timestamp'}
        }},
        {$sort: {count: -1}}
    ], callback);
};
