var aggregate = require('./aggregate');
var reduceTimestamps = require('./helpers/reduce-timestamps');
var getBrowserName = require('./helpers/browser-name');

module.exports = function(params) {
    return aggregate({
        groupBy: 'browserHash',
        filter: function(item) {
            return item.hash.messageHash === params.id;
        },
        create: function(item) {
            return {
                title: getBrowserName(item),
                count: 0,
                stack: item.stack,
                line: item.line,
                url: item.url,
                _id: item.hash.browserHash
            };
        },
        each: function(obj, next) {
            obj.count += 1;
            reduceTimestamps(obj, next);
        }
    });
};
