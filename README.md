# Soph Compare

Sophisticated compare function for JavaScript ordering.

## Motivation

A commom problem in software development is defining a custom order for an object so that it can be compared to other objects of it's type (e.g. sorting an array of objects by a particular property).

Enter **_soph compare_**: an utility function that aims to reduce the need for complicated logic when defining an order over an object type by allowing you to specify the **priority** in which the properties should be checked, a **direction** (ascending / descending), a **converter function** (which can be used to transform values, e.g. string -> boolean) and a **compare function** (which can be user defined or even returned by the soph compare function itself).

By allowing the configuration to receive a compare function you can specifiy precisely the desired order of your object, _no matter how many more containg objects it contains_ (different ordering rules will be generated separately).

## Usage

1. Get the package from npm
```
npm install soph-compare
```
2. Import it in your project

  * require 
```javascript
const sophCompare = require('soph-compare)
```
  * ES6 import
```javascript
import * as sophCompare from 'soph-compare'
```

3. Define a configuration object and call sophCompare to get the compare function
```javascript
const cfg = [
  {
    prop: 'myProp',
    descending: true
  },
  {
    prop: 'anotherProp'
  }
];
const compare = sophCompare(cfg);

compare(arr1, arr2); // -1, 0, 1
arr3.sort(compare);
```

## API

```javascript
function sophCompare(orderList?: OrderItem[]): (a: T, b: T) => number;

interface OrderItem {
    prop?: string | number;
    descending?: boolean;
    converterFn?: (a: T) => T;
    compareFn?: (a: T, b: T) => number;
}
```

The **priority** for evaluating each configuration item is defined by it's index from the configuration array. So, **order is important**.

## Examples

* Basic Usage

```javascript
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
```

* **descending**

```javascript
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
```

* **converterFn**

```javascript
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
```

* User defined **compareFn**

```javascript
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
```

* **compareFn** returned by sophCompare

```javascript
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
```
