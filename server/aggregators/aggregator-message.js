var db = require('../database');
var browserName = require('./browser-name');

module.exports = function(query, callback) {
    db.aggregate([
        {$match: {'hash.messageHash': {$eq: query.id}}},
        {$group: {
            _id: '$hash.browserHash',
            title: {$first: browserName},
            count: {$sum: 1},
            stack: {$first: '$stack'},
            line: {$first: '$line'},
            url: {$first: '$url'},
            earliest: {$min: '$timestamp'},
            latest: {$max: '$timestamp'}
        }},
        {$sort: {count: -1}}
    ], callback);
};
