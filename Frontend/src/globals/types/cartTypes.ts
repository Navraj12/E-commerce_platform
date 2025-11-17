import type { Product } from "./productTypes.ts";
import type { Status } from "./types.ts";

export interface CartItem {
  id: string;
  image: string | undefined;
  Product: Product;
  quantity: number;
  productId: string;
}

export interface CartState {
  items: CartItem[];
  status: Status;
}
