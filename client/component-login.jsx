var React = require('react');

module.exports = React.createClass({
    render: function () {
        return <div className='container'>
            <div className='content'>
            { this.renderError() }
                <div>
                    Login with:
                    <a href='/auth/google'>Google</a>
                </div>
            </div>
        </div>;
    },
    renderError: function () {
        if (this.props.error)
            return <div className="login-error">
                Login Error. Please try again.
            </div>
    }
});
