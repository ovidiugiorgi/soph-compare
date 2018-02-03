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
      name: 'bread',
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
      name: 'banana',
    },
    {
      price: 14,
      name: 'bread',
    },
    {
      price: 32,
      name: 'soy sauce packet',
    },
  ]);
});
