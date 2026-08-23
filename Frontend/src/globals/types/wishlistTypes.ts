import type { Product } from "./productTypes.ts";
import type { Status } from "./types.ts";

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  Product: Product;
}

export interface WishlistState {
  items: WishlistItem[];
  status: Status;
}
