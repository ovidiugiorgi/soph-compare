const sophCompare = require('./sophCompare');

describe('no order provided', () => {
  it('should return soph compare if no order is provided - numbers', () => {
    const arr = [5, 4, -2, 12, 11, 4];
    const arrSorted = [...arr].sort((a, b) => a - b);

    expect(arr.sort(sophCompare())).toEqual(arrSorted);
  });

  it('should return soph compare if no order is provided - strings', () => {
    const arr = ['flower', 'water', 'conditioner', 'water'];
    const arrSorted = [...arr].sort((a, b) => a > b);

    expect(arr.sort(sophCompare())).toEqual(arrSorted);
  });

  it('should return soph compare if an empty order list is provided', () => {
    const arr = [5, 4, -2, 12, 11, 4];
    const arrSorted = [...arr].sort((a, b) => a - b);

    expect(arr.sort(sophCompare([]))).toEqual(arrSorted);
  });
});

describe('prop', () => {
  it('throws error when order items do not have "prop"', () => {
    const cfg = [
      {
        descending: true,
      },
      {
        converterFn: (a) => a + 1,
      },
    ];

    expect(sophCompare(cfg)).toThrowError('No "prop" on order item provided');
  });

  it('should return soph compare when order list has items with prop attached', () => {
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

    expect(arr.sort(sophCompare(cfg))).toEqual([
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

  it('should return soph compare when "prop" is of type number', () => {
    const arr = [[4, 5, 6], [1, 2, 6], [1, 10, 5]];

    const cfg = [
      {
        prop: 0,
      },
      {
        prop: 2,
      },
    ];

    expect(arr.sort(sophCompare(cfg))).toEqual([
      [1, 10, 5],
      [1, 2, 6],
      [4, 5, 6],
    ]);
  });
});

describe('descending', () => {
  it('should return soph compare when order list contains only descending: true', () => {
    const arr = [4, 2, 5, 8, 10];
    const arrSorted = [...arr].sort((a, b) => a < b);

    const cfg = [
      {
        descending: true,
      },
    ];

    expect(arr.sort(sophCompare(cfg))).toEqual(arrSorted);
  });

  it('should return soph compare when order items have descending: true', () => {
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

    expect(arr.sort(sophCompare(cfg))).toEqual([
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
});

describe('converterFn', () => {
  it('should return soph compare when only one order item is provided and it has a converterFn function attached', () => {
    const arr = [1, 2, 3];

    const cfg = [
      {
        converterFn: (a) => a % 2 === 0,
      },
    ];

    expect(arr.sort(sophCompare(cfg))).toEqual([1, 3, 2]);
  });

  it('should return soph compare when order items have a converterFn function attached: any to boolean', () => {
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
        converterFn: (a) => a % 2 === 0,
        descending: true,
      },
      {
        prop: 'name',
      },
    ];

    expect(arr.sort(sophCompare(cfg))).toEqual([
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

  it('should return soph compare when order items have a converterFn function attached: string to number', () => {
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
        converterFn: (a) => a.length,
      },
      {
        prop: 'price',
      },
    ];

    expect(arr.sort(sophCompare(cfg))).toEqual([
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

  it('throws error when only one order item is provided and it has a converterFn attached which is not a function', () => {
    const arr = [1, 2, 3];

    const cfg = [
      {
        converterFn: 2,
      },
    ];

    try {
      expect(arr.sort(sophCompare(cfg))).toThrow();
    } catch (error) {
      expect(error.message).toBe('Provided "converterFn" is not a function');
    }
  });

  it('throws error when order items have a converterFn attached which is not a function', () => {
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
        converterFn: 2,
        descending: true,
      },
    ];

    try {
      expect(arr.sort(sophCompare(cfg))).toThrow();
    } catch (error) {
      expect(error.message).toBe('Provided "converterFn" is not a function');
    }
  });
});

describe('compareFn', () => {
  it('should return soph compare when only one order item is provided and it has a compareFn function attached', () => {
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
        compareFn: (a, b) => a.price - b.price,
      },
    ];

    expect(arr.sort(sophCompare(cfg))).toEqual([
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

  it('should return soph compare when order items have basic compareFns attached', () => {
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
        compareFn: (a, b) => a.count - b.count,
      },
      {
        prop: 'price',
      },
      {
        prop: 'name',
      },
    ];

    expect(arr.sort(sophCompare(cfg))).toEqual([
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

  it('should return soph compare when order items have soph compareFns attached', () => {
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
        compareFn: sophCompare([
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

    expect(arr.sort(sophCompare(cfg))).toEqual([
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

  it('throws error when only one order item is provided and it has a compareFn attached which is not a function', () => {
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
        compareFn: 2,
      },
    ];

    try {
      expect(arr.sort(sophCompare(cfg))).toThrow();
    } catch (error) {
      expect(error.message).toBe('Provided "compareFn" is not a function');
    }
  });

  it('throws error when order items have a compareFn attached which is not a function', () => {
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
        compareFn: 2,
      },
    ];

    try {
      expect(arr.sort(sophCompare(cfg))).toThrow();
    } catch (error) {
      expect(error.message).toBe('Provided "compareFn" is not a function');
    }
  });
});
