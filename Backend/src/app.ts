import express, { Application } from "express";

const app: Application = express();
const PORT: number = 5000;

import * as dotenv from "dotenv";
dotenv.config();
import { dbReady } from "./database/connection";

import cors from "cors";
import jwt from "jsonwebtoken";
import path from "path";
import { Server } from "socket.io";
import { promisify } from "util";
import adminSeeder from "./adminseeder";
import categoryController from "./controllers/categoryController";
import productController from "./controllers/productController";
import User from "./database/models/User";
import adminRoute from "./routes/adminRoute";
import cartRoute from "./routes/cartRoute";
import categoryRoute from "./routes/categoryRoute";
import couponRoute from "./routes/couponRoute";
import orderRoute from "./routes/orderRoute";
import productRoute from "./routes/productRoute";
import reviewRoute from "./routes/reviewRoute";
import userRoute from "./routes/userRoute";
import wishlistRoute from "./routes/wishlistRoute";

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", userRoute);
app.use("/admin/product", productRoute);
app.use("/admin/category", categoryRoute);
app.use("/customer/cart", cartRoute);
app.use("/order", orderRoute);
app.use("/review", reviewRoute);
app.use("/wishlist", wishlistRoute);
app.use("/coupon", couponRoute);
app.use("/admin", adminRoute);

let onlineUsers: any = [];
const addToOnlineUsers = (socketId: string, userId: string, role: string) => {
  onlineUsers = onlineUsers.filter((user: any) => user.userId !== userId);
  onlineUsers.push({ socketId, userId, role });
};

const attachSocketHandlers = (io: Server) => {
  io.on("connection", async (socket) => {
    console.log("A client connected");
    const { token } = socket.handshake.auth;
    if (token) {
      //@ts-ignore
      const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
      //@ts-ignore
      const doesUserExists = await User.findByPk(decoded.id);
      if (doesUserExists) {
        addToOnlineUsers(socket.id, doesUserExists.id, doesUserExists.role);
      }
    }
    socket.on("updatedOrderStatus", ({ status, orderId, userId }) => {
      const findUser = onlineUsers.find((user: any) => user.userId == userId);
      if (findUser) {
        io.to(findUser.socketId).emit("statusUpdated", { status, orderId });
      }
    });
    console.log(onlineUsers);
  });
};

dbReady
  .then(async () => {
    await adminSeeder();
    await categoryController.seedCategory();
    await productController.seedProduct();
    const server = app.listen(PORT, () => {
      console.log("Server has started at port ", PORT);
    });
    console.log("Socket server started at port 5000");
    const io = new Server(server, {
      cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
      },
    });
    attachSocketHandlers(io);
  })
  .catch((err) => {
    console.error("Failed to start server: database not ready", err);
    process.exit(1);
  });
