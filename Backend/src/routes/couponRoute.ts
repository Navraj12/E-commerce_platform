import { RequestHandler, Router } from "express";
import couponController from "../controllers/couponController";
import authMiddleware, { Role } from "../middleware/authMiddleware";
import errorHandler from "../services/catchAsyncError";

const router: Router = Router();

router
  .route("/")
  .post(
    authMiddleware.isAuthenticated as RequestHandler,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    errorHandler(couponController.createCoupon)
  )
  .get(
    authMiddleware.isAuthenticated as RequestHandler,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    errorHandler(couponController.getAllCoupons)
  );

router
  .route("/:id")
  .delete(
    authMiddleware.isAuthenticated as RequestHandler,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    errorHandler(couponController.deleteCoupon)
  );

router.route("/apply").post(errorHandler(couponController.applyCoupon));

export default router;
