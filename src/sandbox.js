const arr = [
  {
    price: 32,
    name: 'soy souce packet',
  },
  {
    price: 52,
    name: 'lala',
  },
  {
    price: 14,
    name: 'bread',
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

arr.sort((a, b) => a.price > b.price);
arr;
