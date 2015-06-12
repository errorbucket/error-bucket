var aggregate = require('./aggregate');
var reduceTimestamps = require('./helpers/reduce-timestamps');
var reduceBrowsers = require('./helpers/reduce-browsers');

module.exports = function() {
    return aggregate({
        groupBy: 'pageHash',
        create: function(item) {
            return {
                title: getTitlePage(item),
                count: 0,
                browsers: [],
                _id: item.hash.pageHash
            };
        },
        each: function(obj, next) {
            obj.count += 1;
            reduceTimestamps(obj, next);
            reduceBrowsers(obj, next);
        }
    });
};

/**
 * @see server/signatures/page-signature.js
 */
function getTitlePage(data) {
    return data.referer? data.referer.toString() : 'No referer';
}
