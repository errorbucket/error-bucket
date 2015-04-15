var aggregate = require('./aggregate');
var reduceTimestamps = require('./reduce-timestamps');
var reduceBrowsers = require('./reduce-browsers');
var sha = require('./sha-hash');

var NO_REFERER = sha('No referer');

module.exports = function(params) {
    return aggregate({
        groupBy: 'message',
        filter: function(item) {
            var referer = item.referer && sha(item.referer.toString());

            return referer === params.id ||
                (params.id === NO_REFERER && !referer);
        },
        create: function(item) {
            return {
                title: item.message,
                count: 0,
                browsers: [],
                id: sha(item.message)
            };
        },
        each: function(obj, next) {
            obj.count += 1;
            reduceTimestamps(obj, next);
            reduceBrowsers(obj, next);
        }
    });
};
