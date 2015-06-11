var aggregate = require('./aggregate');

function genTimestamp(item) {
    return Math.floor(item.timestamp / params.span) * params.span;
}

module.exports = function(params) {
    return aggregate({
        groupBy: genTimestamp,
        filter: function(item) {
            var isMatchingTime = item.timestamp >= params.from && item.timestamp <= params.to;
            var isMatchingQuery = !params.message || item.hash.messageHash === params.message;

            return isMatchingTime && isMatchingQuery;
        },
        create: function(item) {
            return {
                count: 0,
                _id: genTimestamp(item.timestamp)
            };
        },
        each: function(obj) {
            obj.count += 1;
        }
    });
};
