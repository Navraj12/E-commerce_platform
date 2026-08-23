import { Response } from "express";
import Coupon from "../database/models/Coupon";
import { AuthRequest } from "../middleware/authMiddleware";

class CouponController {
  async createCoupon(req: AuthRequest, res: Response): Promise<void> {
    const { code, discountPercent, expiryDate, active } = req.body;
    if (!code || !discountPercent || !expiryDate) {
      res.status(400).json({
        message: "Please provide code, discountPercent, expiryDate",
      });
      return;
    }
    const existing = await Coupon.findOne({ where: { code } });
    if (existing) {
      res.status(409).json({ message: "Coupon with that code already exists" });
      return;
    }
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountPercent,
      expiryDate,
      active: active ?? true,
    });
    res.status(200).json({
      message: "Coupon created successfully",
      data: coupon,
    });
  }

  async getAllCoupons(req: AuthRequest, res: Response): Promise<void> {
    const coupons = await Coupon.findAll();
    res.status(200).json({
      message: "Coupons fetched successfully",
      data: coupons,
    });
  }

  async deleteCoupon(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const deleted = await Coupon.destroy({ where: { id } });
    if (!deleted) {
      res.status(404).json({ message: "No coupon with that id" });
      return;
    }
    res.status(200).json({ message: "Coupon deleted successfully" });
  }

  async applyCoupon(req: AuthRequest, res: Response): Promise<void> {
    const { code, totalAmount } = req.body;
    if (!code) {
      res.status(400).json({ message: "Please provide a coupon code" });
      return;
    }
    const coupon = await Coupon.findOne({
      where: { code: String(code).toUpperCase(), active: true },
    });
    if (!coupon) {
      res.status(404).json({ message: "Invalid or inactive coupon code" });
      return;
    }
    if (new Date(coupon.expiryDate) < new Date()) {
      res.status(400).json({ message: "This coupon has expired" });
      return;
    }
    const amount = Number(totalAmount) || 0;
    const discountAmount = (amount * coupon.discountPercent) / 100;
    res.status(200).json({
      message: "Coupon applied successfully",
      data: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount,
        newTotal: Math.max(amount - discountAmount, 0),
      },
    });
  }
}

export default new CouponController();
