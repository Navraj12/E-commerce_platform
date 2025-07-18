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
router
  .route("/customer/")
  .post(
    authMiddleware.isAuthenticated,
    errorHandler(orderController.fetchMyOrders)
  );
router
  .route("/customer/:id")
  .patch(
    authMiddleware.isAuthenticated,
    errorHandler(orderController.cancelMyOrder)
  )
  .get(
    authMiddleware.isAuthenticated,
    errorHandler(orderController.fetchOrderDetails)
  );

export default router;
