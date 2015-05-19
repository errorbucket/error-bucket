var aggregate = require('./aggregate');
var reduceTimestamps = require('./reduce-timestamps');
var getBrowserName = require('./browser-name');
var getMessageSignature = require('./message-signature');
var sha = require('./sha-hash');

module.exports = function(params) {
    return aggregate({
        groupBy: getBrowserName,
        filter: function(item) {
            return getMessageSignature(item) === params.id;
        },
        create: function(item) {
            return {
                title: getBrowserName(item),
                count: 0,
                stack: item.stack,
                line: item.line,
                url: item.url,
                id: sha(getBrowserName(item))
            };
        },
        each: function(obj, next) {
            obj.count += 1;
            reduceTimestamps(obj, next);
        }
    });
};
