var db = require('../database');

module.exports = function(conn, query, callback) {
    db.aggregate(conn, [
        {$match: {'hash.pageHash': {$eq: query.id}}},
        {$group: {
            _id: '$hash.messageHash',
            title: {$first: '$message'},
            count: {$sum: 1},
            browsers: {$addToSet: '$ua.family'},
            earliest: {$min: '$timestamp'},
            latest: {$max: '$timestamp'},
        }},
        {$sort: {count: -1}}
    ], callback);
};
