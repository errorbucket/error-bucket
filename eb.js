require('./server/require-jsx')();

var config = require('./common/config.js');
var server = require('./server');

server.listen(config.port);
console.log('Listening on port %s', config.port);

module.exports = server;
