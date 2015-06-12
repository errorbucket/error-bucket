var sha = require('../../common/sha-hash');

/**
 * @see aggregator-scripts.js
 */
module.exports = function(data) {
    return sha(data.url + ':' + (data.line || 0));
};
