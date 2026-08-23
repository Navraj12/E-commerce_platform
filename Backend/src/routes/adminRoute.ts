import { RequestHandler, Router } from "express";
import adminController from "../controllers/adminController";
import authMiddleware, { Role } from "../middleware/authMiddleware";
import errorHandler from "../services/catchAsyncError";

const router: Router = Router();

router
  .route("/dashboard-stats")
  .get(
    authMiddleware.isAuthenticated as RequestHandler,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    errorHandler(adminController.getDashboardStats)
  );

export default router;
