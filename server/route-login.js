var _ = require('lodash');
var React = require('react');
var Login = require('../client/component-login.jsx');
var login = React.createFactory(Login);
var config = require('../config/config');

module.exports = function (req, res) {

    var authMethods = [];
    _.forEach(config.authMethods, function(val, key) {
        try {
            // dynamic module loading, may lead to exceptions
            var authAdapter = require('./auth/authentication-'+key)(val, config.baseurl);
            authMethods.push(authAdapter.strategyName);
        } catch (e) { console.log(e); }
    });

    var error = req.params['error'] || null;

    res.render('template-login', {
        app: React.renderToString(login({error: error, authMethods: authMethods}))
    });
};
