const compare = (a, b) => {
  if (a < b) {
    return -1;
  } else if (b < a) {
    return 1;
  }

  return 0;
};

const getSafeFunction = (orderItem, propName) => {
  const prop = orderItem[propName];

  if (typeof prop !== 'function') {
    throw new Error(`Provided "${propName}" is not a function`);
  }

  return prop;
};

const getCompareFunction = (orderItem) => {
  const compareFunction = orderItem.compare
    ? getSafeFunction(orderItem, 'compare')
    : compare;

  return orderItem.descending
    ? (a, b) => -1 * compareFunction(a, b)
    : compareFunction;
};

const getValue = (a, orderItem) => {
  if (!orderItem.prop && orderItem.prop !== 0) {
    throw new Error('No "prop" on order item provided');
  }

  const value = a[orderItem.prop];

  return orderItem.transform
    ? getSafeFunction(orderItem, 'transform')(value)
    : value;
};

const sophCompare = (orderList) => {
  if (!orderList || orderList.length === 0) {
    return compare;
  }

  if (orderList.length === 1 && !orderList[0].prop) {
    const orderItem = orderList[0];
    const compareFunction = getCompareFunction(orderItem);

    if (orderItem.transform) {
      const converterFunction = getSafeFunction(orderItem, 'transform');

      return (a, b) =>
        compareFunction(converterFunction(a), converterFunction(b));
    }

    return compareFunction;
  }

  return (a, b) => {
    for (let index = 0; index < orderList.length; index += 1) {
      const orderItem = orderList[index];
      const compareFunction = getCompareFunction(orderItem);
      const compareResult = compareFunction(
        getValue(a, orderItem),
        getValue(b, orderItem)
      );

      if (compareResult) {
        return compareResult;
      }
    }

    return 0;
  };
};

module.exports = sophCompare;
