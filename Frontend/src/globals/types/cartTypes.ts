import type { Product } from "./productTypes";
import type { Status } from "./types";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  status: Status;
}
