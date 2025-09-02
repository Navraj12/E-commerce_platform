import { RequestHandler, Router } from "express";
import orderController from "../controllers/orderController";
import authMiddleware, { Role } from "../middleware/authMiddleware";
import errorHandler from "../services/catchAsyncError";
const router = Router();

router
  .route("/")
  .post(
    authMiddleware.isAuthenticated,
    errorHandler(orderController.createOrder)
  )
  .get(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    orderController.fetchOrders
  );
router
  .route("/verify")
  .post(
    authMiddleware.isAuthenticated,
    errorHandler(orderController.verifyTransaction)
  );
router
  .route("/customer/")
  .get(
    authMiddleware.isAuthenticated,
    errorHandler(orderController.fetchMyOrders)
  );
router
  .route("/customer/:id")
  .patch(
    authMiddleware.isAuthenticated as RequestHandler,
    authMiddleware.restrictTo(Role.Customer) as RequestHandler,
    errorHandler(orderController.cancelMyOrder)
  )
  .get(
    authMiddleware.isAuthenticated,
    errorHandler(orderController.fetchOrderDetails)
  );

router
  .route("/admin/payment/:id")
  .patch(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    errorHandler(orderController.changePaymentStatus)
  );

router
  .route("/admin/:id")
  .patch(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    errorHandler(orderController.changePaymentStatus)
  )
  .delete(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    errorHandler(orderController.deleteOrder)
  );

export default router;
