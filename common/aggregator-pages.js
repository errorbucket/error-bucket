var aggregate = require('./aggregate');
var reduceTimestamps = require('./reduce-timestamps');
var reduceBrowsers = require('./reduce-browsers');
var composeSHAFunc = require('./compose-sha');

var getSHATitlePage = composeSHAFunc(getTitlePage);

module.exports = function() {
    return aggregate({
        groupBy: getSHATitlePage,
        create: function(item) {
            return {
                title: getTitlePage(item),
                count: 0,
                browsers: [],
                id: getSHATitlePage(item)
            };
        },
        each: function(obj, next) {
            obj.count += 1;
            reduceTimestamps(obj, next);
            reduceBrowsers(obj, next);
        }
    });
};

function getTitlePage(data) {
    return data.referer || 'No referer';
}
