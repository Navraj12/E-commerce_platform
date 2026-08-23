import { RequestHandler, Router } from "express";
import wishlistController from "../controllers/wishlistController";
import authMiddleware from "../middleware/authMiddleware";
import errorHandler from "../services/catchAsyncError";

const router: Router = Router();

router
  .route("/")
  .post(
    authMiddleware.isAuthenticated as RequestHandler,
    errorHandler(wishlistController.addToWishlist)
  )
  .get(
    authMiddleware.isAuthenticated as RequestHandler,
    errorHandler(wishlistController.getWishlist)
  );

router
  .route("/:productId")
  .delete(
    authMiddleware.isAuthenticated as RequestHandler,
    errorHandler(wishlistController.removeFromWishlist)
  );

export default router;
