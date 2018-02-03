const compare = (a, b) => {
  if (a < b) {
    return -1;
  } else if (b < a) {
    return 1;
  }

  return 0;
};

const sophComparator = (orderList) => {
  if (!orderList || orderList.length === 0) {
    return compare;
  }

  return (a, b) => {
    for (let index = 0; index < orderList.length; index += 1) {
      const orderItem = orderList[index];
      const { prop } = orderItem;
      const compareResult = compare(a[prop], b[prop]);

      if (compareResult) {
        return compareResult;
      }
    }

    return 0;
  };
};

module.exports = sophComparator;
