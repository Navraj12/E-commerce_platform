import { Response } from "express";
import Cart from "../database/models/Cart";
import Category from "../database/models/Category";
import Product from "../database/models/Product";
import { AuthRequest } from "../middleware/authMiddleware";

// const cartData ={

//         id: string ,
//         quantity: Number,
//         createdAt:string,
//         updatedAt: string,
//         userId:string,
//         productId: string

// }

class CartController {
  async addToCart(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      res.status(400).json({
        message: "Please provide productId and quantity",
      });
    }
    let cartItem = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId,
        productId,
        quantity,
      });
    }
    res.status(200).json({
      message: "Product added to cart successfully",
      data: cartItem,
    });
  }
  async getMyCarts(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const cartItems = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Product,
          include: [
            {
              model: Category,
              attributes: ["id", "categoryName"],
            },
          ],
        },
      ],
    });
    if (cartItems.length === 0) {
      res.status(404).json({
        message: "No items found in the cart",
      });
    } else {
      res.status(200).json({
        message: "Cart items fetched successfully",
        data: cartItems,
      });
    }
  }

  async deleteMyCartItem(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({
        message: "No product with that id",
      });

      return;
    }
    await Cart.destroy({
      where: {
        userId,
        productId,
      },
    });
    res.status(200).json({
      message: "Product of cart deleted successfully",
    });
  }

  async updateCartItem(req: AuthRequest, res: Response): Promise<void> {
    const { productId } = req.params;
    const userId = req.user?.id;
    const { quantity } = req.body;
    if (!quantity) {
      res.status(400).json({
        message: "Please provide quantity",
      });
      return;
    }
    const cartData: any = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (cartData) cartData.quantity = quantity;
    await cartData?.save();
    res.status(200).json({
      message: "Product of cart updated successfully",
      data: cartData,
    });
  }
}
export default new CartController();
