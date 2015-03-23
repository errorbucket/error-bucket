var page = require('page');
var React = require('react');

module.exports = React.createClass({
    render: function() {
        return <div className='container'>
            <div className='content'>
                Login with:
                <a href='/auth/google'>Google</a>
                </div>
            </div>;
    }
});
