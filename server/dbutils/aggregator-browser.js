var aggregate = require('./aggregate');
var reduceTimestamps = require('./reduce-timestamps');
var getBrowserName = require('./browser-name');
var composeSHAFunc = require('./compose-sha');
var sha = require('./sha-hash');

var getSHABrowserName = composeSHAFunc(getBrowserName);

module.exports = function(params) {
    return aggregate({
        groupBy: 'message',
        filter: function(item) {
            return getSHABrowserName(item) === params.id;
        },
        create: function(item) {
            return {
                title: item.message,
                count: 0,
                id: sha(item.message)
            };
        },
        each: function(obj, next) {
            obj.count += 1;
            reduceTimestamps(obj, next);
        }
    });
};
