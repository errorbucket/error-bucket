
module.exports = function(db, query, callback) {
    db.collection('logs').aggregate([
        {$match: {'hash.scriptHash': {$eq: query.id}}},
        {$group: {
            _id: '$hash.messageHash',
            id: {$first: '$hash.messageHash'},
            title: {$first: '$message'},
            count: {$sum: 1},
            earliest: {$min: '$timestamp'},
            latest: {$max: '$timestamp'},
            browsers: {$addToSet: '$ua.family'}
        }}
    ], callback);
};
