var React = require('react');
var Login = require('../client/component-login.jsx');
var login = React.createFactory(Login);

module.exports = function(req, res) {
    res.render('template-index', {
        app: React.renderToString(login())
    });
};
