var db = require('../database');

module.exports = function(query, callback) {
    var scriptTitle = {$cond: {
        if: {$ifNull: ['$line', false]},
        then: {$concat: ['$url', ':', '$line']},
        else: {$concat: ['$url', ':', '0']}
    }};

    db.aggregate([
        {$group: {
            _id: '$hash.scriptHash',
            title: {$first: scriptTitle},
            count: {$sum: 1},
            browsers: {$addToSet: '$ua.family'},
            earliest: {$min: '$timestamp'},
            latest: {$max: '$timestamp'},
        }},
        {$sort: {count: -1}},
        {$limit: 100}
    ], callback);
};
