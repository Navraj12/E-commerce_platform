import { Router } from "express";
import orderController from "../controllers/orderController";
import authMiddleware from "../middleware/authMiddleware";
import errorHandler from "../services/catchAsyncError";
const router = Router();

router
  .route("/")
  .post(
    authMiddleware.isAuthenticated,
    errorHandler(orderController.createOrder)
  );
router
  .route("/verify")
  .post(
    authMiddleware.isAuthenticated,
    errorHandler(orderController.verifyTransaction)
  );

export default router;
