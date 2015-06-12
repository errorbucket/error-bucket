var should = require('should');
var jsdom = require('jsdom');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var Nav = require('../../client/component-nav.jsx');
var nav = React.createFactory(Nav);

describe('component-nav', function() {
    beforeEach('Setup DOM', function() {
        global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
        global.window = document.parentWindow;
    });

    var tests = [
        {pathname: '/dashboard/', title: 'Dashboard'},
        {pathname: '/messages/', title: 'Messages'},
        {pathname: '/browsers/', title: 'Browsers'},
        {pathname: '/scripts/', title: 'Scripts'},
        {pathname: '/pages/', title: 'Pages'}
    ];

    tests.forEach(function(test) {
        describe('select ' + test.title + ' tab highlight', function() {
            before('simulate selection', function() {
                this.renderedComponent = TestUtils.renderIntoDocument(nav({pathname: test.pathname}));
                this.highlightedTab = TestUtils.findRenderedDOMComponentWithClass(
                    this.renderedComponent,
                    'nav__link_active'
                );
                this.numOfTabs = TestUtils.scryRenderedDOMComponentsWithClass(
                    this.renderedComponent,
                    'nav__link'
                ).length;
            });
            it('should highlight `' + test.title + '` tab', function() {
                (this.highlightedTab.getDOMNode().textContent).should.be.equal(test.title);
            });
            it('should display 5 tabs', function() {
                (this.numOfTabs).should.be.equal(5);
            });
        });
    });

    it('should display `Logout` (6 tabs)', function() {
        this.renderedComponent = TestUtils.renderIntoDocument(nav({pathname: '/logout', logout: true}));
        this.numOfTabs = TestUtils.scryRenderedDOMComponentsWithClass(
            this.renderedComponent,
            'nav__link'
        ).length;
        (this.numOfTabs).should.be.equal(6);
    });

});

