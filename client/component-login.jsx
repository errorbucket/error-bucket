var React = require('react');
var _ = require('lodash');
var cx = require('classnames');

module.exports = React.createClass({
    render: function () {
        return <div className="container">
            <div className="content">
                <div className="login-box">
                    <h1>Error Board</h1>
                    <div className="login-message">
                        { this.renderError() }
                    </div>
                    { this.renderLocalMethod() }
                    { this.renderMethods() }
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
    renderMethods: function () {
        var methods = [];
        _.forEach(this.props.authMethods, function (val) {
            if (val === 'local') return; // continue
            var href = '/auth/' + val;
            var classNames = cx('login-item', 'login-' + val);
            methods.push(
                <a key={ val } className={ classNames } href={ href }>{ val }</a>
            );
        });
        return <div className="login-3rd">{ methods }</div>;
    },
    renderLocalMethod: function () {
        if (_.contains(this.props.authMethods, 'local')) {
            return <div className="login-local">
                <form action="/auth/local" method="post" id="login-form">
                    <div>
                        <input type="text" name="username" placeholder="username" />
                    </div>
                    <div>
                        <input type="password" name="password" placeholder="password" />
                    </div>
                    <div>
                        <button type="submit">✓</button>
                    </div>
                </form>
                <script src="//cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/core-min.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/sha1-min.js"></script>
                <script dangerouslySetInnerHTML={{
                    __html: '(function(){ ' +
                    'document.querySelector("#login-form button").onclick=function(){' +
                        'var a = document.querySelector("#login-form input[type=\'password\']");' +
                        'a.value = CryptoJS.SHA1(a.value);' +
                        'document.getElementById("login-form").submit();'+
                    '};})();'
                    }}>
                </script>
            </div>
        }
    }
});
