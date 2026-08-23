import { Response } from "express";
import Category from "../database/models/Category";
import Product from "../database/models/Product";
import Wishlist from "../database/models/Wishlist";
import { AuthRequest } from "../middleware/authMiddleware";

class WishlistController {
  async addToWishlist(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { productId } = req.body;
    if (!productId) {
      res.status(400).json({ message: "Please provide productId" });
      return;
    }
    const existing = await Wishlist.findOne({ where: { userId, productId } });
    if (existing) {
      res.status(200).json({
        message: "Product already in wishlist",
        data: existing,
      });
      return;
    }
    const wishlistItem = await Wishlist.create({ userId, productId });
    res.status(200).json({
      message: "Product added to wishlist",
      data: wishlistItem,
    });
  }

  async removeFromWishlist(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { productId } = req.params;
    const deleted = await Wishlist.destroy({ where: { userId, productId } });
    if (!deleted) {
      res.status(404).json({ message: "Product not found in wishlist" });
      return;
    }
    res.status(200).json({ message: "Product removed from wishlist" });
  }

  async getWishlist(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const data = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          include: [{ model: Category }],
        },
      ],
    });
    res.status(200).json({
      message: "Wishlist fetched successfully",
      data,
    });
  }
}

export default new WishlistController();
