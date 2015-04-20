var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var sampleFile = path.resolve('./config/config.sample.json');
var configFile = path.resolve('./config/config.json');
var config;

try {
    config = require(configFile);
} catch (err) {
    config = require(sampleFile);
    fs.writeFile(configFile, JSON.stringify(config, null, 4), function (err) {
        err && console.log(err);
    });
}

// if auth field of config.json is not configured or no authentication strategy
// is set to be used, no authentication will be performed
config.useAuth = true;
config.authMethods = {};
if (!config.auth) config.useAuth = false;
else {
    var flag = false;
    _.forEach(config.auth, function(val, key) {
        if (val.enabled === true) {
            flag = true;
            var mtd = {}; mtd[key] = val;
            _.extend(config.authMethods, mtd);
        }
    });
    config.useAuth = flag;
}

// if error alert is correctly configured
config.useAlert = config.errorAlert && config.errorAlert.interval &&
                  config.errorAlert.threshold && config.errorAlert.recipient;

// if keep latest is correctly configured
config.useClearOutdated = config.clearOutdated && config.clearOutdated.frequency &&
                          config.clearOutdated.timespan;

module.exports = config;
