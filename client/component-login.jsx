var React = require('react');
var _ = require('lodash');

module.exports = React.createClass({
    render: function () {
        return <div className='container'>
            <div className='content'>
                { this.renderError() }
                { this.renderLocalMethod() }
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
            if (val === 'local') return; // continue
            var href = '/auth/'+val;
            methods.push(
                <li key={ val }><a href={ href }>{ val }</a></li>
            );
        });
        return methods;
    },
    renderLocalMethod: function () {
        if (_.contains(this.props.authMethods, 'local')) {
            return <form action="/auth/local" method="post" id="login-form">
                <div>
                    <label>Username:</label>
                    <input type="text" name="username"/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password"/>
                </div>
                <div>
                    <input type="submit" label="Login" />
                </div>
            </form>
        }
    }
});
