var _ = require('lodash');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config.js');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new GoogleStrategy({
        clientID: config.oauth2.google.clientID,
        clientSecret : config.oauth2.google.clientSecret,
        callbackURL : config.oauth2.google.callbackURL
    }, validateBaixingEmail));
};

function validateBaixingEmail(token, refreshToken, profile, done) {
    var valid = true;
    profile.emails && _.forEach(profile.emails, function(n) {
        valid = valid && n.value && /@baixing\.(com|net)$/.test(n.value);
    });
    return done(null, valid ? profile : false);
}
