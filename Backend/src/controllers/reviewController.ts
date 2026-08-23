import { Response } from "express";
import Review from "../database/models/Review";
import User from "../database/models/User";
import { AuthRequest } from "../middleware/authMiddleware";

class ReviewController {
  async createReview(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      res.status(400).json({
        message: "Please provide productId and rating",
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
      return;
    }

    const existing = await Review.findOne({ where: { userId, productId } });
    if (existing) {
      res.status(409).json({
        message: "You have already reviewed this product",
      });
      return;
    }

    const review = await Review.create({
      userId,
      productId,
      rating,
      comment,
    });

    res.status(200).json({
      message: "Review added successfully",
      data: review,
    });
  }

  async getReviewsByProduct(req: AuthRequest, res: Response): Promise<void> {
    const { productId } = req.params;
    const reviews = await Review.findAll({
      where: { productId },
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const average =
      reviews.length > 0
        ? reviews.reduce((sum, r: any) => sum + r.rating, 0) / reviews.length
        : 0;

    res.status(200).json({
      message: "Reviews fetched successfully",
      data: reviews,
      average,
      count: reviews.length,
    });
  }

  async deleteReview(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { id } = req.params;
    const review = await Review.findOne({ where: { id, userId } });
    if (!review) {
      res.status(404).json({
        message: "No review found with that id for this user",
      });
      return;
    }
    await review.destroy();
    res.status(200).json({
      message: "Review deleted successfully",
    });
  }
}

export default new ReviewController();
