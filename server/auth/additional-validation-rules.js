var _ = require('lodash');
// additional rules to be applied after open authentication has returned
module.exports = [
    // Sample additional validation rule.
    // Validate if the user holds a Baixing email address
    // NOTE: for this rule to work, Google OAuth2.0 must be used, and scope
    //       must be set to https://www.googleapis.com/auth/userinfo.email
    function (profile) {
        var valid = false;
        profile.emails && _.forEach(profile.emails, function(n) {
            valid = valid || (n.value && /@baixing\.(com|net)$/.test(n.value));
        });
        return valid;
    } /*,
    function (profile) {
        <some other validation logic>
    }
    */
];
