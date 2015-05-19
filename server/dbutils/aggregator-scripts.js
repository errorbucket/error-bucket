var aggregate = require('./aggregate');
var reduceTimestamps = require('./reduce-timestamps');
var reduceBrowsers = require('./reduce-browsers');
var composeSHAFunc = require('./compose-sha');

var getSHATitleScript = composeSHAFunc(getTitleScript);

module.exports = function() {
    return aggregate({
        groupBy: getSHATitleScript,
        create: function(item) {
            return {
                title: getTitleScript(item),
                count: 0,
                browsers: [],
                id: getSHATitleScript(item)
            };
        },
        each: function(obj, next) {
            obj.count += 1;
            reduceTimestamps(obj, next);
            reduceBrowsers(obj, next);
        }
    });
};

function getTitleScript(data) {
    return data.url + ':' + (data.line || 0);
}
