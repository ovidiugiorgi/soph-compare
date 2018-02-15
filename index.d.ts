export = sophCompare;

declare function sophCompare(
  orderList: sophCompare.OrderItem[]
): (a: any, b: any) => number;

declare namespace sophCompare {
  export interface OrderItem {
    prop?: string | number;
    descending?: boolean;
    transform?: (a: any) => any;
    compare?: (a: any, b: any) => number;
    subConfig?: sophCompare.OrderItem[];
  }
}
