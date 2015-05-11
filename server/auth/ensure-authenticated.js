var setupAuthentication = require('./setup-authentication');

module.exports = function(app) {
    // by default, no authentication will be enforced
    var ensureAuthenticated = function(req, res, next) { return next(); };
    if (setupAuthentication(app)) {
        ensureAuthenticated = function(req, res, next) {
            if (req.isAuthenticated()) return next();
            res.redirect('/login');
        }
    }
    return ensureAuthenticated;
};
