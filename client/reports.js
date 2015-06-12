var _ = require('lodash');
var Promise = require('bluebird');
var request = require('superagent');
var aggregators = require('./aggregators');

var _reports = {};

var getKey = function(params) {
    return _.reduce(params, function(result, value, key) {
        return result + '&' + key + '=' + value;
    }, '?');
};

var getParams = function(key) {
    return _.reduce(key.substr(1).split('&'), function(params, pair) {
        var p = pair.split('=');

        params[p[0]] = p[1];

        return params;
    }, {});
};

module.exports = {
    fetch: function(type, params, ephemeral) {
        return new Promise(function(resolve, reject) {

            var key = getKey(params);

            if (!_reports[type]) {
                _reports[type] = {};
            }

            if (_reports[type][key] && !ephemeral) {
                resolve(_reports[type][key]);
            } else {
                request
                    .get('/reports/' + type)
                    .query(params)
                    .set('Accept', 'application/json')
                    .end(function(res) {
                        if (res.ok) {
                            if (!ephemeral) _reports[type][key] = res.body;
                            resolve(res.body);
                        } else {
                            reject(res.text);
                        }
                    });
            }
        });
    },
    get: function(type, params) {
        return (_reports[type] && _reports[type][getKey(params)]) || null;
    },
    update: function(item) {
        for (var type in _reports) {
            var aggregator = aggregators[type];

            if (aggregator) {
                for (var key in _reports[type]) {
                    _reports[type][key] = aggregator(getParams(key))(_reports[type][key], item);
                }
            }
        }
    }
};
