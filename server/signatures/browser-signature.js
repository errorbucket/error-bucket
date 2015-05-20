var sha = require('../../common/sha-hash');

/**
 * @see aggregator-browsers.js
 */
module.exports = function(data) {
    var ua = data.ua;
    var result;

    if (ua.family && ua.major) {
        result = ua.family + ' ' + ua.major + (ua.minor ? '.' + ua.minor : '');
    } else if (ua.family) {
        result = ua.family;
    } else {
        result = 'Unknown';
    }

    return sha(result);
};
