import orderController from "../controllers/orderController";
import authMiddleware from "../middleware/authMiddleware";
import errorHandler from "../services/catchAsyncError";
import router from "./userRoute";

router
  .route("/")
  .post(
    authMiddleware.isAuthenticated,
    errorHandler(orderController.createOrder)
  );

export default router;
