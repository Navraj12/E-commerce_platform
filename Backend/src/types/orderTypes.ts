export interface OrderData {
  phoneNumber: string;
  shippingAddress: string;
  totalAmount: number;
  PaymentDetails: {
    paymentMethod: PaymentMethod;
    paymentStatus?: PaymentStatus;
    pidx?: string;
  };
  items: OrderDetails[];
}

export interface OrderDetails {
  quantity: number;
  productId: string;
}

export enum PaymentMethod {
  Cod = "cod",
  Khalti = "khalti",
}
enum PaymentStatus {
  paid = "paid",
  Unpaid = "unpaid",
}
