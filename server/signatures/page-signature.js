var sha = require('../../common/sha-hash');

/**
 * @see aggregator-pages.js
 */
module.exports = function(data) {
    return sha(data.referer? data.referer.toString() : 'No referer');
};
