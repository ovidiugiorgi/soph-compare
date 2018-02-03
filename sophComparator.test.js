const sophComparator = require('./sophComparator');

it('returns comparator if no order is provided - numbers', () => {
  const arr = [5, 4, -2, 12, 11, 4];
  const arrSorted = [...arr].sort((a, b) => a - b);

  expect(arr.sort(sophComparator())).toEqual(arrSorted);
});

it('returns comparator if no order is provided - strings', () => {
  const arr = ['flower', 'water', 'conditioner', 'water'];
  const arrSorted = [...arr].sort((a, b) => a > b);

  expect(arr.sort(sophComparator())).toEqual(arrSorted);
});

it('returns comparator if an empty order list is provided', () => {
  const arr = [5, 4, -2, 12, 11, 4];
  const arrSorted = [...arr].sort((a, b) => a - b);

  expect(arr.sort(sophComparator([]))).toEqual(arrSorted);
});

it('throws error when order items do not have "prop"', () => {
  const cfg = [
    {
      descending: true,
    },
    {
      converter: (a) => a + 1,
    },
  ];

  expect(sophComparator(cfg)).toThrowError('No "prop" on order item provided');
});

it('returns comparator when order list has items with prop attached', () => {
  const arr = [
    {
      price: 32,
      name: 'soy sauce packet',
    },
    {
      price: 14,
      name: 'avocado',
    },
    {
      price: 14,
      name: 'banana',
    },
  ];

  const cfg = [
    {
      prop: 'price',
    },
    {
      prop: 'name',
    },
  ];

  expect(arr.sort(sophComparator(cfg))).toEqual([
    {
      price: 14,
      name: 'avocado',
    },
    {
      price: 14,
      name: 'banana',
    },
    {
      price: 32,
      name: 'soy sauce packet',
    },
  ]);
});

it('returns comparator when order list contains only descending: true', () => {
  const arr = [4, 2, 5, 8, 10];
  const arrSorted = [...arr].sort((a, b) => a < b);

  const cfg = [
    {
      descending: true,
    },
  ];

  expect(arr.sort(sophComparator(cfg))).toEqual(arrSorted);
});

it('returns comparator when order items have descending: true', () => {
  const arr = [
    {
      price: 32,
      name: 'soy sauce packet',
    },
    {
      price: 14,
      name: 'bread',
    },
    {
      price: 14,
      name: 'avocado',
    },
  ];

  const cfg = [
    {
      prop: 'price',
    },
    {
      prop: 'name',
      descending: true,
    },
  ];

  expect(arr.sort(sophComparator(cfg))).toEqual([
    {
      price: 14,
      name: 'bread',
    },
    {
      price: 14,
      name: 'avocado',
    },
    {
      price: 32,
      name: 'soy sauce packet',
    },
  ]);
});

it('returns comparator when only one order item is provided and it has a converter function attached', () => {
  const arr = [1, 2, 3];

  const cfg = [
    {
      converter: (a) => a % 2 === 0,
    },
  ];

  expect(arr.sort(sophComparator(cfg))).toEqual([1, 3, 2]);
});

it('returns comparator when order items have a converter function attached: any to boolean', () => {
  const arr = [
    {
      price: 32,
      name: 'soy sauce packet',
    },
    {
      price: 48,
      name: 'bread',
    },
    {
      price: 15,
      name: 'avocado',
    },
  ];

  const cfg = [
    {
      prop: 'price',
      converter: (a) => a % 2 === 0,
      descending: true,
    },
    {
      prop: 'name',
    },
  ];

  expect(arr.sort(sophComparator(cfg))).toEqual([
    {
      price: 48,
      name: 'bread',
    },
    {
      price: 32,
      name: 'soy sauce packet',
    },
    {
      price: 15,
      name: 'avocado',
    },
  ]);
});

it('returns comparator when order items have a converter function attached: string to number', () => {
  const arr = [
    {
      price: 32,
      name: 'soy sauce packet',
    },
    {
      price: 48,
      name: 'bread',
    },
    {
      price: 15,
      name: 'avocado',
    },
  ];

  const cfg = [
    {
      prop: 'name',
      converter: (a) => a.length,
    },
    {
      prop: 'price',
    },
  ];

  expect(arr.sort(sophComparator(cfg))).toEqual([
    {
      price: 48,
      name: 'bread',
    },
    {
      price: 15,
      name: 'avocado',
    },
    {
      price: 32,
      name: 'soy sauce packet',
    },
  ]);
});

it('throws error when only one order item is provided and it has a converter attached which is not a function', () => {
  const arr = [1, 2, 3];

  const cfg = [
    {
      converter: 2,
    },
  ];

  try {
    expect(arr.sort(sophComparator(cfg))).toThrow();
  } catch (error) {
    expect(error.message).toBe('Provided "converter" is not a function');
  }
});

it('throws error when order items have a converter attached which is not a function', () => {
  const arr = [
    {
      price: 32,
      name: 'soy sauce packet',
      vendors: {
        count: 10,
        location: 'RO',
      },
    },
    {
      price: 48,
      name: 'bread',
      vendors: {
        count: 3,
        location: 'UK',
      },
    },
  ];

  const cfg = [
    {
      prop: 'price',
      converter: 2,
      descending: true,
    },
  ];

  try {
    expect(arr.sort(sophComparator(cfg))).toThrow();
  } catch (error) {
    expect(error.message).toBe('Provided "converter" is not a function');
  }
});

it('returns a comparator when only one order item is provided and it has a comparator function attached', () => {
  const arr = [
    {
      price: 32,
      name: 'soy sauce packet',
      vendors: {
        count: 10,
        location: 'RO',
      },
    },
    {
      price: 12,
      name: 'bread',
      vendors: {
        count: 3,
        location: 'UK',
      },
    },
  ];

  const cfg = [
    {
      comparator: (a, b) => a.price - b.price,
    },
  ];

  expect(arr.sort(sophComparator(cfg))).toEqual([
    {
      price: 12,
      name: 'bread',
      vendors: {
        count: 3,
        location: 'UK',
      },
    },
    {
      price: 32,
      name: 'soy sauce packet',
      vendors: {
        count: 10,
        location: 'RO',
      },
    },
  ]);
});

it('returns a comparator when order items have basic comparators attached', () => {
  const arr = [
    {
      price: 32,
      name: 'soy sauce packet',
      vendors: {
        count: 10,
        location: 'RO',
      },
    },
    {
      price: 48,
      name: 'bread',
      vendors: {
        count: 3,
        location: 'UK',
      },
    },
    {
      price: 15,
      name: 'avocado',
      vendors: {
        count: 15,
        location: 'DE',
      },
    },
    {
      price: 8,
      name: 'kiwi',
      vendors: {
        count: 15,
        location: 'ES',
      },
    },
  ];

  const cfg = [
    {
      prop: 'vendors',
      comparator: (a, b) => a.count - b.count,
    },
    {
      prop: 'price',
    },
    {
      prop: 'name',
    },
  ];

  expect(arr.sort(sophComparator(cfg))).toEqual([
    {
      price: 48,
      name: 'bread',
      vendors: {
        count: 3,
        location: 'UK',
      },
    },
    {
      price: 32,
      name: 'soy sauce packet',
      vendors: {
        count: 10,
        location: 'RO',
      },
    },
    {
      price: 8,
      name: 'kiwi',
      vendors: {
        count: 15,
        location: 'ES',
      },
    },
    {
      price: 15,
      name: 'avocado',
      vendors: {
        count: 15,
        location: 'DE',
      },
    },
  ]);
});

it('returns comparator when order items have soph comparators attached', () => {
  const arr = [
    {
      price: 32,
      name: 'soy sauce packet',
      vendors: {
        count: 10,
        location: 'RO',
      },
    },
    {
      price: 48,
      name: 'bread',
      vendors: {
        count: 3,
        location: 'UK',
      },
    },
    {
      price: 15,
      name: 'avocado',
      vendors: {
        count: 15,
        location: 'DE',
      },
    },
    {
      price: 8,
      name: 'kiwi',
      vendors: {
        count: 15,
        location: 'NZ',
      },
    },
  ];

  const cfg = [
    {
      prop: 'vendors',
      comparator: sophComparator([
        {
          prop: 'count',
        },
        {
          prop: 'location',
          descending: true,
        },
      ]),
    },
    {
      prop: 'price',
    },
    {
      prop: 'name',
    },
  ];

  expect(arr.sort(sophComparator(cfg))).toEqual([
    {
      price: 48,
      name: 'bread',
      vendors: {
        count: 3,
        location: 'UK',
      },
    },
    {
      price: 32,
      name: 'soy sauce packet',
      vendors: {
        count: 10,
        location: 'RO',
      },
    },
    {
      price: 8,
      name: 'kiwi',
      vendors: {
        count: 15,
        location: 'NZ',
      },
    },
    {
      price: 15,
      name: 'avocado',
      vendors: {
        count: 15,
        location: 'DE',
      },
    },
  ]);
});

it('throws error when only one order item is provided and it has a comparator attached which is not a function', () => {
  const arr = [
    {
      price: 32,
      name: 'soy sauce packet',
      vendors: {
        count: 10,
        location: 'RO',
      },
    },
    {
      price: 12,
      name: 'bread',
      vendors: {
        count: 3,
        location: 'UK',
      },
    },
  ];

  const cfg = [
    {
      comparator: 2,
    },
  ];

  try {
    expect(arr.sort(sophComparator(cfg))).toThrow();
  } catch (error) {
    expect(error.message).toBe('Provided "comparator" is not a function');
  }
});

it('throws error when order items have a comparator attached which is not a function', () => {
  const arr = [
    {
      price: 32,
      name: 'soy sauce packet',
      vendors: {
        count: 10,
        location: 'RO',
      },
    },
    {
      price: 12,
      name: 'bread',
      vendors: {
        count: 3,
        location: 'UK',
      },
    },
  ];

  const cfg = [
    {
      property: 'price',
      comparator: 2,
    },
  ];

  try {
    expect(arr.sort(sophComparator(cfg))).toThrow();
  } catch (error) {
    expect(error.message).toBe('Provided "comparator" is not a function');
  }
});
