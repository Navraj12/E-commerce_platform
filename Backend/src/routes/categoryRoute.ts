import { RequestHandler } from "express";
import categoryController from "../controllers/categoryController";
import authMiddleware, { Role } from "../middleware/authMiddleware";
import router from "./userRoute";

router
  .route("/")
  .post(
    authMiddleware.isAuthenticated as RequestHandler,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    categoryController.addCategory
  )
  .get(categoryController.getCategories);

router
  .route("/:id")
  .delete(
    authMiddleware.isAuthenticated as RequestHandler,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    categoryController.deleteCategory
  )
  .patch(
    authMiddleware.isAuthenticated as RequestHandler,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    categoryController.UpdateCategory
  );

export default router;
