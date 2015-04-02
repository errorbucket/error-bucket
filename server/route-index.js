var React = require('react');
var App = require('../client/component-app.jsx');
var app = React.createFactory(App);
var config = require('../config/config');

module.exports = function(req, res) {
    var props = {
        params: req.params,
        pathname: req.path,
        logout: config.useAuth
    };

    res.render('template-index', {
        app: React.renderToString(app(props))
    });
};
