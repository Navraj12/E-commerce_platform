import { RequestHandler, Router } from "express";
import reviewController from "../controllers/reviewController";
import authMiddleware from "../middleware/authMiddleware";
import errorHandler from "../services/catchAsyncError";

const router: Router = Router();

router
  .route("/")
  .post(
    authMiddleware.isAuthenticated as RequestHandler,
    errorHandler(reviewController.createReview)
  );

router.route("/:productId").get(errorHandler(reviewController.getReviewsByProduct));

router
  .route("/:id")
  .delete(
    authMiddleware.isAuthenticated as RequestHandler,
    errorHandler(reviewController.deleteReview)
  );

export default router;
