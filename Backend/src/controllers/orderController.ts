import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { OrderData } from "../types/orderTypes";
import Order from "../database/models/Order";
import Payment from "../database/models/Payment";
import OrderDetail from "../database/models/OrderDetails";
import { PaymentMethod } from "../types/orderTypes"; // Use named import for PaymentMethod

class OrderController {
  async createOrder(req: AuthRequest, res: Response): Promise<void> {
const userId = req.user?.id
    const {
      phoneNumber,
      shippingAddress,
      totalAmount,
      PaymentDetails,
      items,
    }: OrderData = req.body;
    if (
      !phoneNumber ||
      !shippingAddress ||
      !totalAmount ||
      !PaymentDetails ||
      !PaymentDetails.paymentMethod ||
      items.length == 0
    ) {
      res.status(400).json({
        message:
          "Please provide phoneNumber,shippingAddress,totalAmount,PaymentDetails,items",
      });
      return;
    }
const orderData = await Order.create({
phoneNumber,
shippingAddress,
totalAmount,
userId
})
await Payment.create({
paymentMethod: PaymentDetails.paymentMethod
})
for (var i = 0; i<items.length; i++){
  await OrderDetail.create({
quantity: items[i].quantity,
productId: items[0].productId,
orderId : orderData.id
})
}
if(PaymentDetails.paymentMethod == PaymentMethod.Khalti){
//khalti integration
}{
res.status(200).json({
message:"order placed successfully"})
}
  }
}
