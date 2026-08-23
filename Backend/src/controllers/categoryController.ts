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

  // One-time default icon assignment for categories that don't have one yet.
  private getDefaultIconForCategory(categoryName: string): string {
    const name = (categoryName || "").toLowerCase();
    if (name.includes("electronic")) return "💻";
    if (name.includes("grocery") || name.includes("food")) return "🛒";
    if (name.includes("fashion") || name.includes("cloth")) return "👕";
    if (name.includes("beauty")) return "💄";
    if (name.includes("home") || name.includes("furniture")) return "🛋️";
    if (name.includes("sport")) return "⚽";
    if (name.includes("book")) return "📚";
    if (name.includes("toy")) return "🧸";
    if (name.includes("health")) return "💊";
    return "🏷️";
  }

  async seedCategory(): Promise<void> {
    const datas = await Category.findAll();
    if (datas.length === 0) {
      await Category.bulkCreate(
        this.categoryData.map((c) => ({
          ...c,
          categoryIcon: this.getDefaultIconForCategory(c.categoryName),
        }))
      );
      console.log("Categories seeded successfully");
    } else {
      console.log("Categories already seeded");
    }

    // Backfill: assign a default icon to any existing category missing one.
    // Runs once per row (only updates rows where categoryIcon IS NULL).
    const categoriesMissingIcon = await Category.findAll({
      where: { categoryIcon: null },
    });
    for (const category of categoriesMissingIcon) {
      await category.update({
        categoryIcon: this.getDefaultIconForCategory(category.categoryName),
      });
    }
    if (categoriesMissingIcon.length > 0) {
      console.log(
        `Backfilled categoryIcon for ${categoriesMissingIcon.length} categories`
      );
    }
  }

  async addCategory(req: AuthRequest, res: Response): Promise<void> {
    const { categoryName, categoryIcon } = req.body;
    if (!categoryName) {
      res.status(400).json({
        message: "Please provide categoryName",
      });
      return;
    }
    await Category.create({
      categoryName,
      categoryIcon: categoryIcon ?? this.getDefaultIconForCategory(categoryName),
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
    const { categoryName, categoryIcon } = req.body;
    await Category.update(
      { categoryName, ...(categoryIcon !== undefined ? { categoryIcon } : {}) },
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
