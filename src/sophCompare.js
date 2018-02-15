const defaultCompare = (a, b) => {
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
  const { subConfig, compare } = orderItem;

  if (subConfig && compare) {
    throw new Error(
      'Both subConfig and compare cannot be provided for the same order item'
    );
  }

  let compareFunction = defaultCompare;

  if (orderItem.subConfig) {
    compareFunction = sophCompare(orderItem.subConfig);
  } else if (orderItem.compare) {
    compareFunction = getSafeFunction(orderItem, 'compare');
  }

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

const sophCompare = (config) => {
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
    const orderItem = config[0];
    const compareFunction = getCompareFunction(orderItem);

    if (orderItem.transform) {
      const converterFunction = getSafeFunction(orderItem, 'transform');

      return (a, b) =>
        compareFunction(converterFunction(a), converterFunction(b));
    }

    return compareFunction;
  }

  return (a, b) => {
    for (let index = 0; index < config.length; index += 1) {
      const orderItem = config[index];
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
