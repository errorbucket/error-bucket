
module.exports = function(db, query, callback) {
    var browserName = {$cond: {
        if: {$ifNull: ['$ua.family', false]},
        then: {$cond: {
            if: {$ifNull: ['$ua.major', false]},
            then: {$cond: {
                if: {$ifNull: ['$ua.minor', false]},
                then: {$concat: ['$ua.family', ' ', '$ua.major', '.', '$ua.minor']},
                else: {$concat: ['$ua.family', ' ', '$ua.major']}
            }},
            else: "$ua.family"
        }},
        else: "Unknown"
    }};
    db.collection('logs').aggregate([
        {$group: {
            _id: '$hash.browserHash', //TODO: id and _id are duplicated
            title: {$first: browserName},
            count: {$sum: 1},
            id: {$first: '$hash.browserHash'},
            earliest: {$min: '$timestamp'},
            latest: {$max: '$timestamp'}
        }},
        {$sort: {count: -1}},
        {$limit: 100}
    ], callback);
};
