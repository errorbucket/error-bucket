var db = require('../database');

module.exports = function(query, callback) {
    db.aggregate([
        {$group: {
            _id: '$hash.messageHash',
            count: {$sum: 1},
            browsers: {$addToSet: '$ua.family'},
            title: {$first: '$message'},
            earliest: {$min: '$timestamp'},
            latest: {$max: '$timestamp'}
        }},
        {$sort: {count: -1}},
        {$limit: 100}
    ], callback);
};
