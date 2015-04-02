// Adapter for Google OAuth 2.0 API
module.exports = function(method, baseurl) {
    return {
        strategyName: 'google',
        strategyConfiguration: {
            clientID: method.clientID,
            clientSecret: method.clientSecret,
            callbackURL: baseurl+'/auth/callback/google'
        },
        authenticationConfiguration: {
            scope: "https://www.googleapis.com/auth/userinfo.email"
        },
        strategy: require('passport-google-oauth').OAuth2Strategy
    };
};
