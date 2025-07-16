import axios from "axios";
import { response, Response } from "express";
import Order from "../database/models/Order";
import OrderDetail from "../database/models/OrderDetails";
import Payment from "../database/models/Payment";
import { AuthRequest } from "../middleware/authMiddleware";
import { OrderData, PaymentMethod } from "../types/orderTypes";

class OrderController {
  async createOrder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
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
      userId,
    });
    await Payment.create({
      paymentMethod: PaymentDetails.paymentMethod,
    });
    for (var i = 0; i < items.length; i++) {
      await OrderDetail.create({
        quantity: items[i].quantity,
        productId: items[0].productId,
        orderId: orderData.id,
      });
    }
    if (PaymentDetails.paymentMethod == PaymentMethod.Khalti) {
      //Khalti integration
      const data = {
        return_url: "http://localhost:3000/success",
        purchase_order_id: orderData.id,
        amount: totalAmount * 100,
        website_url: "http://localhost:3000",
        purchase_order_name: "orderName_" + orderData.id,
      };
      axios.post("https://dev.khalti.com/api/v2/epayment/initiate/", data, {
        headers: {
          Authorization: "key 64c175cb75ae4b8da15979bde25a520b",
        },
      });
      console.log(response);
    } else {
      res.status(200).json({
        message: "order placed successfully",
      });
    }
  }
}

export default new OrderController();
