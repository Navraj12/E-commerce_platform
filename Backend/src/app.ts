import dotenv from "dotenv";
import express, { Application } from "express";
import "./database/connection";
import userRoute from "./routes/userRoute";
// import './model/index';
import cors from "cors";
import cartRoute from "./routes/cartRoute";
import CategoryRoute from "./routes/categoryRoute";
import orderRoute from "./routes/orderRoute";
import productRoute from "./routes/productRoute";
import path from "path";
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello World');
// });

// app.get('/about', (req: Request, res: Response) => {
//   res.send('About Page');
// });
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
//admin seeder
// adminSeeder();

app.use("/", userRoute);
app.use("/admin/product", productRoute);
app.use("/admin/category", CategoryRoute);
app.use("/customer/cart", cartRoute);
app.use("/order", orderRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
path.join(__dirname, "../src/uploads")

app.listen(PORT, () => {
  // categoryController.seedCategory();
  console.log("server is running on port", PORT);
});
