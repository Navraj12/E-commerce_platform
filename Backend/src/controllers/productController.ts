import { Response } from "express";
import Category from "../database/models/Category";
import Product from "../database/models/Product";
import User from "../database/models/User";
import { AuthRequest } from "../middleware/authMiddleware";

class ProductController {
  async addProduct(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {
      productName,
      productDescription,
      productTotalStockQty,
      productPrice,
      categoryId,
    } = req.body;

    console.log(new Date(Date.now()).toString());

    console.log(Date.now());

    const fileName =
      req.file?.filename ??
      "https://images.pexels.com/photos/17606024/pexels-photo-17606024.jpeg?cs=srgb&dl=pexels-mark-rz-17606024.jpg&fm=jpg";

    if (
      !productName ||
      !productDescription ||
      !productTotalStockQty ||
      !productPrice ||
      !categoryId
    ) {
      res.status(400).json({
        message:
          "Please provide productName, productDescription,productTotalStockQty,productPrice ,categoryId",
      });
      return;
    }
    await Product.create({
      productName,
      productDescription,
      productPrice,
      productTotalStockQty,
      productImageUrl: fileName,

      userId: userId,
      categoryId: categoryId,
    });
    res.status(200).json({
      message: "Product added successfully",
    });
  }

  async getAllProducts(req: AuthRequest, res: Response): Promise<void> {
    const data = await Product.findAll({
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
        {
          model: Category,
        },
      ],
    });
    res.status(200).json({
      message: "Products fetched successfully",
      data,
    });
  }
}
export default new ProductController();
