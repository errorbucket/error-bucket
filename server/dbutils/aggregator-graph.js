var aggregate = require('./aggregate');
var getMessageSignature = require('./message-signature');

module.exports = function(params) {
    return aggregate({
        groupBy: function(item) {
            return Math.floor(item.timestamp / params.span) * params.span;
        },
        filter: function(item) {
            var isMatchingTime = item.timestamp >= params.from && item.timestamp <= params.to;
            var isMatchingQuery = !params.message || getMessageSignature(item) === params.message;

            return isMatchingTime && isMatchingQuery;
        },
        create: {
            count: 0
        },
        each: function(obj) {
            obj.count += 1;
        }
    });
};
