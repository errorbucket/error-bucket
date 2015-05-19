var aggregate = require('./aggregate');
var reduceTimestamps = require('./reduce-timestamps');
var reduceBrowsers = require('./reduce-browsers');
var sha = require('./sha-hash');

module.exports = function(params) {
    return aggregate({
        groupBy: 'message',
        filter: function(item) {
            var url = item.url;
            var line = item.line || 0;

            return sha(url + ':' + line) === params.id;
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
