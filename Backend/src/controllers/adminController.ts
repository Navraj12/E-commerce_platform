import { Response } from "express";
import Order from "../database/models/Order";
import Payment from "../database/models/Payment";
import Product from "../database/models/Product";
import User from "../database/models/User";
import { AuthRequest } from "../middleware/authMiddleware";

class AdminController {
  async getDashboardStats(req: AuthRequest, res: Response): Promise<void> {
    const [totalOrders, totalProducts, totalUsers, orders, recentOrders] =
      await Promise.all([
        Order.count(),
        Product.count(),
        User.count(),
        Order.findAll({ attributes: ["totalAmount"] }),
        Order.findAll({
          include: [
            { model: Payment },
            { model: User, attributes: ["username", "email"] },
          ],
          order: [["createdAt", "DESC"]],
          limit: 5,
        }),
      ]);

    const totalRevenue = orders.reduce(
      (sum, order: any) => sum + Number(order.totalAmount || 0),
      0
    );

    res.status(200).json({
      message: "Dashboard stats fetched successfully",
      data: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        recentOrders,
      },
    });
  }
}

export default new AdminController();
