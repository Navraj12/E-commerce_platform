import { Response } from "express";
import Category from "../database/models/Category";
import { AuthRequest } from "../middleware/authMiddleware";

class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics",
    },
    {
      categoryName: "Groceries",
    },
    {
      categoryName: "Food/Beverages",
    },
  ];

  async seedCategory(): Promise<void> {
    const datas = await Category.findAll();
    if (datas.length === 0) {
      const data = await Category.bulkCreate(this.categoryData);
      console.log("Categories seeded successfully");
    } else {
      console.log("Categories already seeded");
    }
  }

  async addCategory(req: AuthRequest, res: Response): Promise<void> {
    const { categoryName } = req.body;
    if (!categoryName) {
      res.status(400).json({
        message: "Please provide categoryName",
      });
      return;
    }
    await Category.create({
      categoryName,
    });

    res.status(200).json({
      message: "Category added successfully",
    });
  }

  async getCategories(req: AuthRequest, res: Response): Promise<void> {
    const data = await Category.findAll();
    res.status(200).json({
      message: "Categories fetched",
      data,
    });
  }

  async deleteCategory(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const data = await Category.findAll({
      where: {
        id,
      },
    });
    if (data.length === 0) {
      res.status(404).json({
        message: "No category with that id",
      });
    } else {
      await Category.destroy({
        where: {
          id,
        },
      });
      res.status(200).json({
        message: "Category deleted successfully",
      });
    }
  }

  async UpdateCategory(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.body;
    const { categoryName } = req.body;
    await Category.update(
      { categoryName },
      {
        where: {
          id,
        },
      }
    );
    res.status(200).json({
      message: "Category updated",
    });
  }
}

export default new CategoryController();
