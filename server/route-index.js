var React = require('react');
var App = require('../client/component-app.jsx');
var app = React.createFactory(App);
var Login = require('../client/component-login.jsx');
var login = React.createFactory(Login);
var config = require('./config');

module.exports = function(req, res) {

    if(req.params.type === 'login'){

        var props = {
            authMethods: Object.keys(config.authMethods),
            error: req.params['error'] || null
        };

        res.render('template-login', {
            app: React.renderToString(login(props))
        });

    } else {

        var props = {
            params: req.params,
            pathname: req.path,
            logout: config.useAuth
        };

        res.render('template-index', {
            app: React.renderToString(app(props))
        });
    }

};
