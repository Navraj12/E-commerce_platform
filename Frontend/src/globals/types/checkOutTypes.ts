import type { Status } from "./types";

export const PaymentMethod = {
  COD: "cod",
  Khalti: "khalti",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

enum OrderStatus {
  Pending = "pending",
  Delivered = "delivered",
  Ontheway = "ontheway",
  Cancelled = "cancelled",
  Preparation = "preparation",
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
  myOrders: MyOrderData[]
}

export interface MyOrderData {
  id: string;
  userId: string;
  phoneNumber: string;
  shippingAddress: string;
  totalAmount: number;
  Payment: OrderPaymentData;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
