require('./server/require-jsx')();

var config = require('./config/config');
var server = require('./server');

server.listen(config.port);
console.log('Listening on port %s', config.port);

module.exports = server;
