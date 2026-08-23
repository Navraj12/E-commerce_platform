import { Status } from "./types.ts";

interface User {
  id: string;
  email: string;
  username: string;
}
interface Category {
  id: string;
  categoryName: string;
}
export interface Product {
  id: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productTotalStockQty: number;
  productImageUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  categoryId: string;
  User: User;
  Category: Category;
  averageRating?: number;
  reviewCount?: number;
  isFeatured?: boolean | null;
  originalPrice?: number | null;
  discountPercent?: number | null;
}

export interface ProductState {
  product: Product[];
  status: Status;
  singleProduct: Product | null;
}
