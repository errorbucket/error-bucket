// Adapter for Google OAuth 2.0 API
module.exports = function(method) {
    return {
        strategyName: 'google',
        strategyConfiguration: method.strategyConfiguration,
        authenticationConfiguration: method.authenticationConfiguration,
        strategy: require('passport-google-oauth').OAuth2Strategy
    };
};
