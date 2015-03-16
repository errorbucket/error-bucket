var _ = require('lodash');
var React = require('react/addons');
var cx = React.addons.classSet;

module.exports = React.createClass({
    render: function() {
        var totalNumberOfPages = Math.ceil(this.props.total / this.props.perPage);
        console.log("totalNumberOfPages", totalNumberOfPages);
        var items = _.map(_.range(totalNumberOfPages), function(num) {
            return this.renderItem(num + 1);
        }, this);
        return <div className='pagination' >
            { items }
        </div>;
    },
    renderItem: function(num) {
        var classes = cx({
            'pagination__item': true,
            'pagination__item_selected': this.props.current == num
        });
        return <span className={ classes } onClick={ _.partial(this.props.onClick, num) }>
                { num }
            </span>
    }
});
