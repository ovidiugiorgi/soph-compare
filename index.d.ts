export = sophComparator;

declare function sophComparator(orderList: OrderItem[]): (a: T, b: T) => number;

declare namespace sophComparator {
  export interface OrderItem {
    prop: string | number;
    descending: boolean;
    converterFn: (a: T) => T;
    compareFn: (a: T, b: T) => number;
  }
}
