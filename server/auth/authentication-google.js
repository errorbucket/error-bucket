// Adapter for Google OAuth 2.0 API
// This authentication method supports email validation by either:
//      1. suffix array
//      2. email regexp

var _ = require('lodash');

var config = require('../../config');
var validateEmail = require('./validate-email');

var enabled = config.useAuth && _.contains(Object.keys(config.authMethods), 'google');

if (enabled) {
    var method = config.authMethods.google;
    var baseurl = config.baseurl || "http://localhost:3000";

    var strategy = require('passport-google-oauth').OAuth2Strategy;
    var strategyName = 'google';
    var strategyConfiguration = {
        clientID: method.clientID,
        clientSecret: method.clientSecret,
        callbackURL: baseurl + '/auth/callback/google'
    };
    var authenticationConfiguration = {
        scope: "https://www.googleapis.com/auth/userinfo.email"
    };
    var emailpattern = method.emailpattern || false;

    exports.strategyName = strategyName;
    exports.strategyConfiguration = strategyConfiguration;
    exports.authenticationConfiguration = authenticationConfiguration;
    exports.strategy = new strategy(strategyConfiguration, function(token, refreshToken, profile, done) {
        try {
            var user = profile.id;
            if (!emailpattern) done(null, user);
            else {
                if (_.isArray(emailpattern) &&
                    validateEmail.validateEmailWithSuffixArray(profile, emailpattern)) {
                    done(null, user);
                } else if (_.isString(emailpattern) &&
                    validateEmail.validateEmailWithPattern(profile, emailpattern)) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            }
        } catch (e) { done(e, false); }
    });
} else {
    module.exports = null;
}
