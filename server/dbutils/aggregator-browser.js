
module.exports = function(db, query, callback) {
    db.collection('logs').aggregate([
        {$match: {'hash.browserHash': {$eq: query.id}}},
        {$group: {
            _id: '$hash.messageHash',
            id: {$first: '$hash.messageHash'},
            title: {$first: '$message'},
            count: {$sum: 1},
            earliest: {$min: '$timestamp'},
            latest: {$max: '$timestamp'}
        }}
    ], callback);
};
