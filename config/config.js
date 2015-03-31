var fs = require('fs');
var path = require('path');
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

module.exports = config;
