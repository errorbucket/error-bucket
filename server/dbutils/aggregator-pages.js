
module.exports = function(db, query, callback) {
    var pageTitle = {$ifNull: ['$referer', 'No referer']};
    db.collection('logs').aggregate([
        {$group: {
            _id: '$hash.pageHash',
            id: {$first: '$hash.pageHash'},
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
