var _ = require('lodash');
var React = require('react');
var Login = require('../client/component-login.jsx');
var login = React.createFactory(Login);
var config = require('./config');

module.exports = function (req, res) {

    var authMethods = Object.keys(config.authMethods);

    var error = req.params['error'] || null;

    res.render('template-login', {
        app: React.renderToString(login({error: error, authMethods: authMethods}))
    });
};
