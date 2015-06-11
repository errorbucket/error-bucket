var _ = require('lodash');

var hashProp = function(name) {
    return function(obj) {
        return obj['hash'][name];
    };
};

var value = function(v) {
    return function() {
        if (_.isObject(v)) {
            return _.cloneDeep(v);
        } else {
            return v;
        }
    };
};

module.exports = function(params) {
    var filter = params.filter || value(true);

    if (_.isString(params.groupBy)) {
        params.groupBy = hashProp(params.groupBy);
    }

    if (!_.isFunction(params.create)) {
        params.create = value(params.create);
    }

    return function(dataset, next) {
        if (filter(next)) {
            var group = params.groupBy(next);
            var groupIndex = _.findIndex(dataset, {_id: group});
            var item = null;
            if (groupIndex !== -1) {
                item = dataset[groupIndex];
            } else {
                item = params.create(next);
                dataset.push(item);
            }

            params.each(item, next);
        }

        return dataset;
    };
};
