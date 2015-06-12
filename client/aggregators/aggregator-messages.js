var aggregate = require('./aggregate');
var reduceTimestamps = require('./helpers/reduce-timestamps');
var reduceBrowsers = require('./helpers/reduce-browsers');

module.exports = function() {
    return aggregate({
        groupBy: 'messageHash',
        create: function(item) {
            return {
                title: item.message,
                count: 0,
                browsers: [],
                _id: item.hash.messageHash
            };
        },
        each: function(obj, next) {
            obj.count += 1;
            reduceTimestamps(obj, next);
            reduceBrowsers(obj, next);
        }
    });
};
