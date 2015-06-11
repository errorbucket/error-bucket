var aggregate = require('./aggregate');
var reduceTimestamps = require('./helpers/reduce-timestamps');
var getBrowserName = require('./helpers/browser-name');

module.exports = function() {
    return aggregate({
        groupBy: 'browserHash',
        create: function(item) {
            return {
                title: getBrowserName(item),
                count: 0,
                _id: item.hash.browserHash
            };
        },
        each: function(obj, next) {
            obj.count += 1;
            reduceTimestamps(obj, next);
        }
    });
};
