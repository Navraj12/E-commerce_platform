import axios from "axios";
import { Request, Response } from "express";
import Cart from "../database/models/Cart";
import Order from "../database/models/Order";
import OrderDetail from "../database/models/OrderDetails";
import Payment from "../database/models/Payment";
import Product from "../database/models/Product";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  KhaltiResponse,
  OrderData,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  TransactionStatus,
  TransactionVerificationResponse,
} from "../types/orderTypes";

class ExtendedOrder extends Order {
  declare paymentId: string | null;
}

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
    // console.log( PaymentDetails.paymentMethod);
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

    const paymentData = await Payment.create({
      paymentMethod: PaymentDetails.paymentMethod,
    });
    // console.log(paymentData);
    const orderData = await Order.create({
      phoneNumber,
      shippingAddress,
      totalAmount,
      userId,
      paymentId: paymentData.id,
    });
    // console.log("something", orderData);

    let responseOrderData;

    for (var i = 0; i < items.length; i++) {
      responseOrderData = await OrderDetail.create({
        quantity: items[i].quantity,
        productId: items[0].productId,
        orderId: orderData.id,
      });
      await Cart.destroy({
        where: {
          productId: items[i].productId,
          userId: userId,
        },
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
      const khaltiRes = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: "key 64c175cb75ae4b8da15979bde25a520b",
          },
        }
      );
      const KhaltiResponse: KhaltiResponse = khaltiRes.data;
      paymentData.pidx = KhaltiResponse.pidx;
      await paymentData.save();
      res.status(200).json({
        message: "order placed successfully",
        url: KhaltiResponse.payment_url,
        data: responseOrderData,
      });
      // console.log(url);
    } else {
      res.status(200).json({
        message: "order placed successfully",
      });
    }
  }

  async verifyTransaction(req: AuthRequest, res: Response): Promise<void> {
    const { pidx } = req.body;
    const userId = req.user?.id;
    if (!pidx) {
      res.status(400).json({
        message: "please provide pidx",
      });
      return;
    }
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: "key 64c175cb75ae4b8da15979bde25a520b",
        },
      }
    );
    const data: TransactionVerificationResponse = response.data;
    // console.log(data);
    if (data.status === TransactionStatus.Completed) {
      await Payment.update(
        { paymentStatus: "paid" },
        {
          where: {
            pidx: pidx,
          },
        }
      );
      res.status(200).json({
        message: "Payment verified successfully",
      });
      // let order = await Order.findAll({
      //   where: {
      //     userId,
      //   },
      //   include: [
      //     {
      //       model: Payment,
      //     },
      //   ],
      // });
    } else {
      res.status(200).json({
        message: "Payment not verified",
      });
    }
  }

  async fetchMyOrders(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orders = await Order.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Payment,
        },
      ],
    });
    if (orders.length > 0) {
      res.status(200).json({
        message: "order fetched successfully",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "you haven't ordered anything yet..",
        data: [],
      });
    }
  }

  async fetchOrderDetails(req: AuthRequest, res: Response): Promise<void> {
    const orderId = req.params.id;
    const orderDetails = await OrderDetail.findAll({
      where: {
        orderId,
      },
      include: [
        {
          model: Product,
        },
      ],
    });
    if (orderDetails.length > 0) {
      res.status(200).json({
        message: "orderDetails fetched successfully",
        data: orderDetails,
      });
    } else {
      res.status(404).json({
        message: "No any orderDetails of that id",
        data: [],
      });
    }
  }

  async cancelMyOrder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orderId = req.params.id;
    const order: any = await Order.findAll({
      where: {
        userId,
        id: orderId,
      },
    });
    if (
      order?.OrderStatus === OrderStatus.Ontheway ||
      order.OrderStatus == OrderStatus.Preparation
    ) {
      res.status(200).json({
        message: "You cannot cancel order when it is in ontheway or prepared",
      });
      return;
    }
    await Order.update(
      { OrderStatus: OrderStatus.Cancelled },
      {
        where: {
          id: orderId,
        },
      }
    );
    res.status(200).json({
      message: "Order cancelled successfully",
    });
  }

  //Admin side starts here
  async changeOrderStatus(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const orderStatus: OrderStatus = req.body.orderStatus;
    await Order.update(
      {
        orderStatus: orderStatus,
      },
      {
        where: {
          id: orderId,
        },
      }
    );
    res.status(200).json({
      message: "Order Status updated successfully",
    });
  }

  async changePaymentStatus(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const paymentStatus: PaymentStatus = req.body.paymentStatus;
    const order = await Order.findByPk(orderId);
    const extendedOrder: ExtendedOrder = order as ExtendedOrder;
    await Payment.update(
      {
        paymentStatus: paymentStatus,
      },
      {
        where: {
          id: extendedOrder.paymentId,
        },
      }
    );

    res.status(200).json({
      message: `Payment Status of orderId ${orderId} updated successfully to ${paymentStatus}`,
    });
  }

  async deleteOrder(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId);
    const extendedOrder: ExtendedOrder = order as ExtendedOrder;
    if (order) {
      await OrderDetail.destroy({
        where: {
          orderId: orderId,
        },
      });
      await Payment.destroy({
        where: {
          id: extendedOrder.paymentId,
        },
      });
      await Order.destroy({
        where: {
          id: orderId,
        },
      });

      res.status(200).json({
        message: "Order deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "No order with that orderId",
      });
    }
  }
}

export default new OrderController();
