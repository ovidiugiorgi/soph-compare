'use strict';

var defaultCompare = function defaultCompare(a, b) {
  if (a < b) {
    return -1;
  } else if (b < a) {
    return 1;
  }

  return 0;
};

var getSafeFunction = function getSafeFunction(orderItem, propName) {
  var prop = orderItem[propName];

  if (typeof prop !== 'function') {
    throw new Error('Provided "' + propName + '" is not a function');
  }

  return prop;
};

var getCompareFunction = function getCompareFunction(orderItem) {
  var subConfig = orderItem.subConfig,
      compare = orderItem.compare;


  if (subConfig && compare) {
    throw new Error('Both subConfig and compare cannot be provided for the same order item');
  }

  var compareFunction = defaultCompare;

  if (orderItem.subConfig) {
    compareFunction = sophCompare(orderItem.subConfig);
  } else if (orderItem.compare) {
    compareFunction = getSafeFunction(orderItem, 'compare');
  }

  return orderItem.descending ? function (a, b) {
    return -1 * compareFunction(a, b);
  } : compareFunction;
};

var getValue = function getValue(a, orderItem) {
  if (!orderItem.prop && orderItem.prop !== 0) {
    throw new Error('No "prop" on order item provided');
  }

  var value = a[orderItem.prop];

  return orderItem.transform ? getSafeFunction(orderItem, 'transform')(value) : value;
};

var sophCompare = function sophCompare(config) {
  if (!config) {
    return defaultCompare;
  }

  if (!Array.isArray(config)) {
    throw new Error('Config should be an array');
  }

  if (config.length === 0) {
    return defaultCompare;
  }

  if (config.length === 1 && !config[0].prop) {
    var orderItem = config[0];
    var compareFunction = getCompareFunction(orderItem);

    if (orderItem.transform) {
      var converterFunction = getSafeFunction(orderItem, 'transform');

      return function (a, b) {
        return compareFunction(converterFunction(a), converterFunction(b));
      };
    }

    return compareFunction;
  }

  return function (a, b) {
    for (var index = 0; index < config.length; index += 1) {
      var _orderItem = config[index];
      var _compareFunction = getCompareFunction(_orderItem);
      var compareResult = _compareFunction(getValue(a, _orderItem), getValue(b, _orderItem));

      if (compareResult) {
        return compareResult;
      }
    }

    return 0;
  };
};

module.exports = sophCompare;
