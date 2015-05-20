var crypto = require('crypto'); // unstable node built-in module

module.exports = function (str) {
    return crypto.createHash('sha1').update(str).digest('hex');
};
