var _ = require('lodash');
var sha = require('./sha-hash');

module.exports = function (func) {
    return _.compose(sha, func);
};
