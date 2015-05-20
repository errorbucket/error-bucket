var sha = require('../../common/sha-hash');

module.exports = function(data) {
    return sha(JSON.stringify({
        message: data.message,
        line: data.line,
        url: data.url
    }));
};
