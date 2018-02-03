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

it('returns comparator when order list has basic items', () => {
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

it('returns comparator when order list contains only DESC direction', () => {
  const arr = [4, 2, 5, 8, 10];
  const arrSorted = [...arr].sort((a, b) => a < b);

  const cfg = [
    {
      direction: 'DESC',
    },
  ];

  expect(arr.sort(sophComparator(cfg))).toEqual(arrSorted);
});

it('returns comparator when order items have DESC direction', () => {
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
      direction: 'DESC',
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

it('returns comparator when order items have a converter function attached: convert to boolean', () => {
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
      direction: 'DESC',
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

it('returns comparator when order items have converter from string to number', () => {
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
          direction: 'DESC',
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
