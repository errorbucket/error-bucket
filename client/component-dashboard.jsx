var React = require('react');

var Reports = require('./reports');
var Graph = require('./component-graph.jsx');

var span = 10 * 60 * 1000; // ten minutes
var FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;

module.exports = React.createClass({
    getInitialState: function() {
        return {
            from: Math.floor( (Date.now() - FOUR_DAYS) / span) * span, // four days ago
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
        this._interval = setInterval(this.forceUpdate.bind(this), span);
        Reports.fetch('graph', this._getReportParams()).done(this.updateGraphData);
    },
    componentWillUnmount: function() {
        clearInterval(this._interval);
    },
    updateGraphData: function() {
        this.setState({
            data: Reports.get('graph', this._getReportParams())
        });
    },
    _getReportParams: function() {
        return {
            from: this.state.from,
            to: this.state.to,
            span: span
        };
    },
});
