export = sophCompare;

declare function sophCompare(orderList: OrderItem[]): (a: T, b: T) => number;

declare namespace sophCompare {
  export interface OrderItem {
    prop?: string | number;
    descending?: boolean;
    converterFn?: (a: T) => T;
    compareFn?: (a: T, b: T) => number;
  }
}
