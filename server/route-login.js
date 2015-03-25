var React = require('react');
var Login = require('../client/component-login.jsx');
var login = React.createFactory(Login);

module.exports = function (req, res) {

    var props = req.params['error'] || null;

    res.render('template-login', {
        app: React.renderToString(login({error: props}))
    });
};
