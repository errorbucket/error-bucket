var db = require('../database');

module.exports = function(query, callback) {
    db.aggregate([
        {$match: {'hash.browserHash': {$eq: query.id}}},
        {$group: {
            _id: '$hash.messageHash',
            title: {$first: '$message'},
            count: {$sum: 1},
            earliest: {$min: '$timestamp'},
            latest: {$max: '$timestamp'}
        }},
        {$sort: {count: -1}}
    ], callback);
};
