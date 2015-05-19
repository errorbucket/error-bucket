var aggregate = require('./aggregate');
var reduceTimestamps = require('./reduce-timestamps');
var getBrowserName = require('./browser-name');
var composeSHAFunc = require('./compose-sha');

var genSHABrowserName = composeSHAFunc(getBrowserName);

module.exports = function() {
    return aggregate({
        groupBy: genSHABrowserName,
        create: function(item) {
            return {
                title: getBrowserName(item),
                count: 0,
                id: genSHABrowserName(item)
            };
        },
        each: function(obj, next) {
            obj.count += 1;
            reduceTimestamps(obj, next);
        }
    });
};
