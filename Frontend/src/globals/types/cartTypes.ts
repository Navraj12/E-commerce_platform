import type { Product } from "./productTypes.ts";
import type { Status } from "./types.ts";

export interface CartItem {
  image: string | undefined;
  Product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  status: Status;
}
