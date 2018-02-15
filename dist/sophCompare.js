'use strict';

var compare = function compare(a, b) {
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
  var compareFunction = orderItem.compare
    ? getSafeFunction(orderItem, 'compare')
    : compare;

  return orderItem.descending
    ? function(a, b) {
        return -1 * compareFunction(a, b);
      }
    : compareFunction;
};

var getValue = function getValue(a, orderItem) {
  if (!orderItem.prop && orderItem.prop !== 0) {
    throw new Error('No "prop" on order item provided');
  }

  var value = a[orderItem.prop];

  return orderItem.transform
    ? getSafeFunction(orderItem, 'transform')(value)
    : value;
};

var sophCompare = function sophCompare(orderList) {
  if (!orderList || orderList.length === 0) {
    return compare;
  }

  if (orderList.length === 1 && !orderList[0].prop) {
    var orderItem = orderList[0];
    var compareFunction = getCompareFunction(orderItem);

    if (orderItem.transform) {
      var converterFunction = getSafeFunction(orderItem, 'transform');

      return function(a, b) {
        return compareFunction(converterFunction(a), converterFunction(b));
      };
    }

    return compareFunction;
  }

  return function(a, b) {
    for (var index = 0; index < orderList.length; index += 1) {
      var _orderItem = orderList[index];
      var _compareFunction = getCompareFunction(_orderItem);
      var compareResult = _compareFunction(
        getValue(a, _orderItem),
        getValue(b, _orderItem)
      );

      if (compareResult) {
        return compareResult;
      }
    }

    return 0;
  };
};

module.exports = sophCompare;
