// Adapter for Github OAuth 2.0 API
// This authentication method supports organization membership validation.

var _ = require('lodash');
var request = require('superagent');

var config = require('../config');

var enabled = config.useAuth && _.contains(Object.keys(config.authMethods), 'github');

if (enabled) {
    var method = config.authMethods.github;
    var baseurl = config.baseurl || "http://localhost:3000";

    var strategy = require('passport-github').Strategy;
    var strategyName = 'github';
    var strategyConfiguration = {
        clientID: method.clientID,
        clientSecret: method.clientSecret,
        callbackURL: baseurl + '/auth/callback/github'
    };
    var authenticationConfiguration = {
        scope: "read:org"
    };
    var membership = method.organizationMembership || false;

    exports.strategyName = strategyName;
    exports.strategyConfiguration = strategyConfiguration;
    exports.authenticationConfiguration = authenticationConfiguration;
    exports.strategy = new strategy(strategyConfiguration, function(token, refreshToken, profile, done) {
        try {
            var user = profile.id;
            if (!membership) return done(null, user);
            var org_url = profile._json.organizations_url;
            request.get(org_url)
                .query({'access_token': token})
                .end(function(err, res){
                    if (err || !res.body) done(err, false);
                    var valid = false;
                    _.forEach(res.body, function(item) {
                        if ( _.contains(membership, item.login) ) {
                            valid = true;
                            return false; // break
                        }
                    });
                    done(null, valid ? user : false);
                });
        } catch (e) { done(e, false); }
    });
} else {
    module.exports = null;
}
