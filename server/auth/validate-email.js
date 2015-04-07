// email address validation helpers
var _ = require('lodash');

module.exports = {
    validateEmailWithSuffixArray: function (profile, array) {
        var valid = false;
        profile.emails && _.forEach(profile.emails, function (n) {
            try {
                var suffix = /^.+@(.+)$/.exec(n.value)[1];
                valid = valid || (n.value && _.contains(array, suffix));
            } catch (e) {
                console.log(e);
            }
        });
        return valid;
    },
    validateEmailWithPattern: function (profile, pattern) {
        var valid = false;
        var re = new RegExp(pattern);
        profile.emails && _.forEach(profile.emails, function (n) {
            valid = valid || (n.value && re.test(n.value));
        });
        return valid;
    }
};
