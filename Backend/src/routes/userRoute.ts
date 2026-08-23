import express, { RequestHandler, Router } from "express";
import AuthController from "../controllers/userController";
import authMiddleware, { Role } from "../middleware/authMiddleware";
import errorHandler from "../services/catchAsyncError";
const router: Router = express.Router();

router.route("/register").post(errorHandler(AuthController.registerUser));
router.route("/login").post(errorHandler(AuthController.loginUser));
router
  .route("/request-reset")
  .post(errorHandler(AuthController.requestPasswordReset));
router
  .route("/reset-password")
  .post(errorHandler(AuthController.resetPassword));
router
  .route("/profile")
  .get(
    authMiddleware.isAuthenticated,
    errorHandler(AuthController.getProfile)
  );

router
  .route("/users")
  .get(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    errorHandler(AuthController.fetchUsers)
  );

router
  .route("/users/:id")
  .delete(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    errorHandler(AuthController.deleteUser)
  );

router
  .route("/users/:id/role")
  .patch(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    errorHandler(AuthController.updateUserRole)
  );

export default router;
