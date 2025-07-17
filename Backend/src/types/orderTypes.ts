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

export interface KhaltiResponse {
  pidx: string;
  payment_url: string;
  expires_at: Date | string;
  expires_in: number;
  user_fee: number;
}

export interface TransactionVerificationResponse {
  pidx: string;
  total_amount: number;
  status: TransactionStatus;
  transaction_id: string;
  fee: number;
  refunded: boolean;
}

export enum TransactionStatus {
  completed = "completed",
  Refunded = "refunded",
  Pending = "pending",
  Initiated = "initiated",
  Completed = "Completed",
}
