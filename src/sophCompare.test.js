const sophCompare = require('./sophCompare');

describe('config', () => {
  it('should return soph compare if no config is provided - numbers', () => {
    const arr = [5, 4, -2, 12, 11, 4];

    expect(arr.sort(sophCompare())).toEqual([-2, 4, 4, 5, 11, 12]);
  });

  it('should return soph compare if no config is provided - strings', () => {
    const arr = ['flower', 'water', 'conditioner', 'water'];

    expect(arr.sort(sophCompare())).toEqual([
      'conditioner',
      'flower',
      'water',
      'water',
    ]);
  });

  it('should return soph compare if an empty config array is provided', () => {
    const arr = [5, 4, -2, 12, 11, 4];

    expect(arr.sort(sophCompare([]))).toEqual([-2, 4, 4, 5, 11, 12]);
  });

  it('should throw error when config is not an array', () => {
    try {
      sophCompare({});
    } catch (error) {
      expect(error.message).toBe('Config should be an array');
    }
  });
});

describe('prop', () => {
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

    const config = [
      {
        prop: 'price',
      },
      {
        prop: 'name',
      },
    ];

    expect(arr.sort(sophCompare(config))).toEqual([
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

    const config = [
      {
        prop: 0,
      },
      {
        prop: 2,
      },
    ];

    expect(arr.sort(sophCompare(config))).toEqual([
      [1, 10, 5],
      [1, 2, 6],
      [4, 5, 6],
    ]);
  });

  it('should throw error when order items do not have prop', () => {
    const arr = [5, 4, -2, 12, 11, 4];

    const config = [
      {
        descending: true,
      },
      {
        transform: (a) => a + 1,
      },
    ];

    try {
      expect(arr.sort(sophCompare(config)).toThrow());
    } catch (error) {
      expect(error.message).toBe('No "prop" on order item provided');
    }
  });
});

describe('descending', () => {
  it('should return soph compare when order list contains only descending: true', () => {
    const arr = [4, 2, 5, 8, 10];
    const arrSorted = [...arr].sort((a, b) => a < b);

    const config = [
      {
        descending: true,
      },
    ];

    expect(arr.sort(sophCompare(config))).toEqual(arrSorted);
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

    const config = [
      {
        prop: 'price',
      },
      {
        prop: 'name',
        descending: true,
      },
    ];

    expect(arr.sort(sophCompare(config))).toEqual([
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

describe('transform', () => {
  it('should return soph compare when only one order item is provided and it has a transform function attached', () => {
    const arr = [1, 2, 3];

    const config = [
      {
        transform: (a) => a % 2 === 0,
      },
    ];

    expect(arr.sort(sophCompare(config))).toEqual([1, 3, 2]);
  });

  it('should return soph compare when order items have a transform function attached: any to boolean', () => {
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

    const config = [
      {
        prop: 'price',
        transform: (a) => a % 2 === 0,
        descending: true,
      },
      {
        prop: 'name',
      },
    ];

    expect(arr.sort(sophCompare(config))).toEqual([
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

  it('should return soph compare when order items have a transform function attached: string to number', () => {
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

    const config = [
      {
        prop: 'name',
        transform: (a) => a.length,
      },
      {
        prop: 'price',
      },
    ];

    expect(arr.sort(sophCompare(config))).toEqual([
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

  it('should throw error when only one order item is provided and it has a transform property attached which is not a function', () => {
    const config = [
      {
        transform: 2,
      },
    ];

    try {
      expect(sophCompare(config)).toThrow();
    } catch (error) {
      expect(error.message).toBe('Provided "transform" is not a function');
    }
  });

  it('should throw error when order items have a transform property attached which is not a function', () => {
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

    const config = [
      {
        prop: 'price',
        transform: 2,
        descending: true,
      },
    ];

    try {
      expect(arr.sort(sophCompare(config))).toThrow();
    } catch (error) {
      expect(error.message).toBe('Provided "transform" is not a function');
    }
  });
});

describe('compare', () => {
  it('should return soph compare when only one order item is provided and it has a compare function attached', () => {
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

    const config = [
      {
        compare: (a, b) => a.price - b.price,
      },
    ];

    expect(arr.sort(sophCompare(config))).toEqual([
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

  it('should return soph compare when order items have a basic compare function attached', () => {
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

    const config = [
      {
        prop: 'vendors',
        compare: (a, b) => a.count - b.count,
      },
      {
        prop: 'price',
      },
      {
        prop: 'name',
      },
    ];

    expect(arr.sort(sophCompare(config))).toEqual([
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

  it('should return soph compare when order items have a soph compare function attached', () => {
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

    const config = [
      {
        prop: 'vendors',
        compare: sophCompare([
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

    expect(arr.sort(sophCompare(config))).toEqual([
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

  it('should throw error when only one order item is provided and it has a compare property attached which is not a function', () => {
    const config = [
      {
        compare: 2,
      },
    ];

    try {
      expect(sophCompare(config)).toThrow();
    } catch (error) {
      expect(error.message).toBe('Provided "compare" is not a function');
    }
  });

  it('should throw error when order items have a compare property attached which is not a function', () => {
    const config = [
      {
        property: 'price',
        compare: 2,
      },
    ];

    try {
      expect(sophCompare(config)).toThrow();
    } catch (error) {
      expect(error.message).toBe('Provided "compare" is not a function');
    }
  });
});

describe('subConfig', () => {
  it('should return soph compare when subConfig is provided', () => {
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

    const config = [
      {
        prop: 'vendors',
        subConfig: [
          {
            prop: 'count',
          },
          {
            prop: 'location',
            descending: true,
          },
        ],
      },
      {
        prop: 'price',
      },
      {
        prop: 'name',
      },
    ];

    expect(arr.sort(sophCompare(config))).toEqual([
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

  it('should throw error when both subConfig and compare are provided', () => {
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

    const config = [
      {
        prop: 'vendors',
        subConfig: [
          {
            prop: 'count',
          },
          {
            prop: 'location',
            descending: true,
          },
        ],
        compare: (a, b) => a.count - b.count,
      },
      {
        prop: 'price',
      },
      {
        prop: 'name',
      },
    ];

    try {
      expect(arr.sort(sophCompare(config))).toThrow();
    } catch (error) {
      expect(error.message).toBe(
        'Both subConfig and compare cannot be provided for the same order item'
      );
    }
  });
});
