export = sophCompare;

declare function sophCompare(orderList: sophCompare.OrderItem[]): (a: any, b: any) => number;

declare namespace sophCompare {
  export interface OrderItem {
    prop?: string | number;
    descending?: boolean;
    converterFn?: (a: any) => any;
    compareFn?: (a: any, b: any) => number;
  }
}
