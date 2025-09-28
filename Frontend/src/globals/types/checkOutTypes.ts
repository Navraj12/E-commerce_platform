import type { Product } from "./productTypes";
import type { Status } from "./types";

export const PaymentMethod = {
  COD: "cod",
  Khalti: "khalti",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export enum OrderStatus {
  Pending = "pending",
  Delivered = "delivered",
  Ontheway = "ontheway",
  Cancelled = "cancelled",
  Preparation = "preparation",
  All = "all",
  Cancel = "Cancel",
}

export interface ItemDetails {
  productId: string;
  quantity: number;
}

export interface OrderResponseItem extends ItemDetails {
  orderId: string;
}

enum PaymentStatus {
  Paid = "paid",
  Unpaid = "unpaid",
  Pending = "pending",
}

interface Payment {
  paymentMethod: PaymentMethod;
}

interface OrderPaymentData extends Payment {
  paymentStatus: PaymentStatus;
}

export interface OrderData {
  phoneNumber: string;
  shippingAddress: string;
  totalAmount: number;
  paymentDetails: {
    paymentMethod: PaymentMethod;
  };
  items: ItemDetails[];
}

export interface OrderResponseData {
  state: MyOrderData;
  items: OrderResponseItem[];
  status: Status;
  khaltiUrl: string | null;
  myOrders: MyOrderData[];
  orderDetails: OrderDetails[];
}

interface UserData {
  username: string;
  email: string;
}

export interface MyOrderData {
  id: string;
  userId: UserData;
  phoneNumber: string;
  shippingAddress: string;
  totalAmount: number;
  Payment: OrderPaymentData;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetails {
  id: string;
  quantity: number;
  orderId: string;
  Product: Product;
  Order: MyOrderData;
}
