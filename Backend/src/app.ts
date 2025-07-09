import dotenv from "dotenv";
import express, { Application } from "express";
import "./database/connection";
import userRoute from "./routes/userRoute";
// import './model/index';
import adminSeeder from "./adminseeder";
import categoryController from "./controllers/categoryController";
import productRoute from "./routes/productRoute";
import CategoryRoute from "./routes/categoryRoute";
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

//admin seeder
adminSeeder();

app.use("/", userRoute);
app.use("/admin/product", productRoute);
app.use("/admin/category",CategoryRoute)

app.listen(PORT, () => {
  categoryController.seedCategory();
  console.log("server is running on port", PORT);
});
