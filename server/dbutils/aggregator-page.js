
module.exports = function(db, query, callback) {
    db.collection('logs').aggregate([
        {$match: {'hash.pageHash': {$eq: query.id}}},
        {$group: {
            _id: '$hash.messageHash',
            id: {$first: '$hash.messageHash'},
            title: {$first: '$message'},
            count: {$sum: 1},
            browsers: {$addToSet: '$ua.family'},
            earliest: {$min: '$timestamp'},
            latest: {$max: '$timestamp'},
        }},
        {$sort: {count: -1}}
    ], callback);
};
