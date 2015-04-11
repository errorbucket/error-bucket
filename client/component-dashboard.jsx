var React = require('react');
var _ = require('lodash');

var Reports = require('./reports');
var Graph = require('./component-graph.jsx');

var span = 10 * 60 * 1000; // ten minutes
var FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;

module.exports = React.createClass({
    getInitialState: function() {
        return {
            from: fourDaysAgo(),
            to: Date.now(),
            data: {}
        };
    },
    render: function() {
        return <div className='dashboard'>
            <div className='title title_big'>
                Errors in the last 4 days per 10 minutes
            </div>
            <Graph data={ this.state.data } from={ this.state.from } to={ this.state.to } span= { span } />
        </div>;
    },
    componentDidMount: function() {
        this.fetchGraphData();
        this._interval = setInterval(this.fetchGraphData, span);
    },
    componentWillUnmount: function() {
        clearInterval(this._interval);
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return !_.isEqual(nextState.data, this.state.data);
    },
    fetchGraphData: function() {
        this.setState({
            from: fourDaysAgo(),
            to: Date.now()
        });
        Reports.fetch('graph', {
            from: this.state.from,
            to: this.state.to,
            span: span
        }, true).done(this.updateGraphData);
    },
    updateGraphData: function(items) {
        this.setState({
            data: items
        });
    }
});

function fourDaysAgo() {
    return Math.floor( (Date.now() - FOUR_DAYS) / span) * span;
}
