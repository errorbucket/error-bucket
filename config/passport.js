var GoogleStrategy = require('passport-google').Strategy;
var config = require('./config.js');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use('google', new GoogleStrategy({
        clientID: config.oauth2.google.clientID,
        clientSecret : config.oauth2.google.clientSecret,
        callbackURL : config.oauth2.google.callbackURL
    },
    function(token, refreshToken, profile, done) {
        console.log(token);
        process.nextTick(function() {
            return done(null, profile);
        });
    }));
}
