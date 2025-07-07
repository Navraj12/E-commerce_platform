import { Request, Response } from "express";
import Product from "../database/models/Product";


class ProductController {
  async addProduct(req: Request, res: Response): Promise<void> {
    const {
      productName,
      productDescription,
      productTotalStockQty,
      productPrice,
    } = req.body;

    const fileName =
      req.file?.filename ??
      "https://images.pexels.com/photos/17606024/pexels-photo-17606024.jpeg?cs=srgb&dl=pexels-mark-rz-17606024.jpg&fm=jpg";

    if (
      !productName ||
      !productDescription ||
      !productTotalStockQty ||
      !productPrice
    ) {
      res.status(400).json({
        message:
          "Please provide productName, productDescription,productTotalStockQty,productPrice",
      });
      return;
    }
    await Product.create({
      productName,
      productDescription,
      productPrice,
      productTotalStockQty,
      imageUrl: fileName,
    });
    res.status(200).json({
      message: "Product added successfully",
    });
  }
}
export default new ProductController();
