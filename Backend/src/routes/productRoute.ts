import express, { RequestHandler, Router } from "express";
import productController from "../controllers/productController";
import authMiddleware, { Role } from "../middleware/authMiddleware";

// import Role from "../middleware/authMiddleware";
import { multer, storage } from "../middleware/multerMiddleware";

const upload = multer({ storage: storage });
const router: Router = express.Router();

router
  .route("/")
  .post(
    authMiddleware.isAuthenticated as RequestHandler,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    upload.single("productImageUrl"),
    productController.addProduct
  )
  .get(productController.getAllProducts);

router
  .route("/:id")
  .get(productController.getSingleProduct)
  .delete(
    authMiddleware.isAuthenticated as RequestHandler,
    authMiddleware.restrictTo(Role.Admin) as RequestHandler,
    productController.deleteProduct
  );

export default router;
