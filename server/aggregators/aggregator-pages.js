var db = require('../database');

module.exports = function(query, callback) {
    var pageTitle = {$ifNull: ['$referer', 'No referer']};

    db.aggregate([
        {$group: {
            _id: '$hash.pageHash',
            title: {$first: pageTitle},
            count: {$sum: 1},
            browsers: {$addToSet: '$ua.family'},
            earliest: {$min: '$timestamp'},
            latest: {$max: '$timestamp'}
        }},
        {$sort: {count: -1}},
        {$limit: 100}
    ], callback);
};
