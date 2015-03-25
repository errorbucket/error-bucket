var _ = require('lodash');

var config = require('./config.js');

var strategies = {
    googleOAuth2 : require('passport-google-oauth').OAuth2Strategy
    /*
    facebook : require('passport-facebook').Strategy,
    twitter : require('passport-twitter').Strategy
     */
};

/**
 * Configure passport object to use specified strategy
 * @param passportObj
 * @param type - name of strategy
 */
module.exports = function(passportObj, type) {
    if (!config.auth) return;

    var strategy = strategies[type];
    var strategyConf = config.auth[type];

    passportObj.serializeUser(function(user, done) {
        done(null, user);
    });

    passportObj.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passportObj.use(new strategy(strategyConf, function(token, refreshToken, profile, done) {
        return done(null, baixingEmailRule(profile)); // here you can cascade as many custom validation rules by using && operator
    }));
};

function baixingEmailRule(profile) {
    var valid = false;
    profile.emails && _.forEach(profile.emails, function(n) {
        valid = valid || (n.value && /@baixing\.(com|net)$/.test(n.value));
    });
    return valid;
}
