import type { MyOrderData } from "./checkOutTypes.ts";
import type { Status } from "./types.ts";

export interface Category {
  id: string;
  categoryName: string;
  categoryIcon?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  expiryDate: string;
  active: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: MyOrderData[];
}

export interface AdminState {
  stats: DashboardStats | null;
  orders: MyOrderData[];
  users: AdminUser[];
  status: Status;
}

export interface CategoryState {
  categories: Category[];
  status: Status;
}

export interface CouponState {
  coupons: Coupon[];
  status: Status;
}
