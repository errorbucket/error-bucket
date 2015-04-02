var React = require('react');
var _ = require('lodash');

module.exports = React.createClass({
    render: function () {
        return <div className='container'>
            <div className='content'>
            { this.renderError() }
                <div>
                    Login with:
                </div>
                <div>
                    <ul>
                        { this.renderMethods() }
                    </ul>
                </div>
            </div>
        </div>;
    },
    renderError: function () {
        if (this.props.error)
            return <div className="login-error">
                Login Error. Please try again.
            </div>
    },
    renderMethods: function() {
        var methods = [];
        _.forEach(this.props.authMethods, function(val) {
            var href = '/auth/'+val;
            methods.push(
                <li key={ val }><a href={ href }>{ val }</a></li>
            );
        });
        return methods;
    }
});
