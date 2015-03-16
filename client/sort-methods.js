var _ = require('lodash');

var _storage_key = "__et_sort_key";
var _valid_sort_keys = ["count", "latest"];

// By default, we use "count" as sort key

function _sort_by(key, a, b) {
    if (key === "latest") {
        return b.latest - a.latest;
    } else {
        return b.count - a.count;
    }
}

function _is_sorted_by(key, list) {
    if (key === "latest") {
        return _.every(list, function (item, index, list) {
            return index === 0 || list[index - 1].latest >= item.latest;
        });
    } else {
        return _.every(list, function (item, index, list) {
            return index === 0 || list[index - 1].count >= item.count;
        });
    }
}

function _sortKey() {
    var sk = sessionStorage.getItem(_storage_key);
    return sk ? sk : "count";
}

function _setSortKey(key) {
    if (_valid_sort_keys.indexOf(key) == -1) return;
    sessionStorage.setItem(_storage_key, key);
}

function _sort(a, b) {
    return _sort_by(_sortKey(), a, b);
}

function _isSorted(list) {
    return _is_sorted_by(_sortKey(), list);
}

module.exports = {
    sortKey : _sortKey,
    setSortKey : _setSortKey,
    sort : _sort,
    isSorted : _isSorted
};
