// Adapter for LocalStrategy
// This authentication method supports username/password validation
// This file acts as an example

var _ = require('lodash');
var md5 = require('blueimp-md5').md5;

var config = require('../../config/config');

var enabled = config.useAuth && _.contains(Object.keys(config.authMethods), 'local');

if (enabled) {
    var method = config.authMethods.local;

    var strategy = require('passport-local').Strategy;
    var strategyName = 'local';
    var users = method.users || [{ username: 'admin', password: 'admin' }]; // admin

    exports.strategyName = strategyName;
    exports.strategy = new strategy(function(username, password, done) {
        if (validateUsernameAndPassword(users, username, password)) {
            done(null, username);
        } else {
            done(null, false);
        }
    });
} else {
    module.exports = null;
}

function validateUsernameAndPassword(users, username, password) {
    var valid = false;
    _.forEach(users, function(val) {
        if (val.username === username && md5(val.password) === password) {
            valid = true;
            return false;
        }
    });
    return valid;
}
