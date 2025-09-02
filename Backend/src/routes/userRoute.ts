import express, { RequestHandler, Router } from "express";
import AuthController from "../controllers/userController";
import authMiddleware, { Role } from "../middleware/authMiddleware";
import errorHandler from "../services/catchAsyncError";
const router: Router = express.Router();

router.route("/register").post(errorHandler(AuthController.registerUser));
router.route("/login").post(errorHandler(AuthController.loginUser));
router
  .route("/users")
  .get(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    errorHandler(AuthController.fetchUsers)
  );

export default router;
