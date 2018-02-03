const compare = (a, b) => {
  if (a < b) {
    return -1;
  } else if (b < a) {
    return 1;
  }

  return 0;
};

const inverseCompare = (a, b) => -1 * compare(a, b);

const getCompareFunction = (direction) =>
  direction === 'DESC' ? inverseCompare : compare;

const getValue = (a, orderItem) =>
  orderItem.converter
    ? orderItem.converter(a[orderItem.prop])
    : a[orderItem.prop];

const sophComparator = (orderList) => {
  if (!orderList || orderList.length === 0) {
    return compare;
  }

  if (orderList.length === 1 && orderList[0].direction) {
    return getCompareFunction(orderList[0].direction);
  }

  return (a, b) => {
    for (let index = 0; index < orderList.length; index += 1) {
      const orderItem = orderList[index];
      const compareFunction = getCompareFunction(orderItem.direction);
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

module.exports = sophComparator;
