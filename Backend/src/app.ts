import * as dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { Application } from "express";
import jwt from "jsonwebtoken";
import path from "path";
import { Server } from "socket.io";

import adminSeeder from "./adminseeder";
import { dbReady } from "./database/connection";

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

const app: Application = express();

app.use(
  cors({
    origin: "*",
  }),
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

let onlineUsers: any[] = [];

const addToOnlineUsers = (socketId: string, userId: string, role: string) => {
  onlineUsers = onlineUsers.filter((user: any) => user.userId !== userId);

  onlineUsers.push({
    socketId,
    userId,
    role,
  });
};

const attachSocketHandlers = (io: Server) => {
  io.on("connection", async (socket) => {
    console.log("A client connected");

    const { token } = socket.handshake.auth;

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.SECRET_KEY as string,
        ) as jwt.JwtPayload;

        const doesUserExists = await User.findByPk(decoded.id);

        if (doesUserExists) {
          addToOnlineUsers(socket.id, doesUserExists.id, doesUserExists.role);
        }
      } catch (error) {
        console.error("Socket authentication failed:", error);
      }
    }

    socket.on("updatedOrderStatus", ({ status, orderId, userId }) => {
      const findUser = onlineUsers.find((user: any) => user.userId == userId);

      if (findUser) {
        io.to(findUser.socketId).emit("statusUpdated", {
          status,
          orderId,
        });
      }
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter(
        (user: any) => user.socketId !== socket.id,
      );

      console.log("Client disconnected");
      console.log("Online users:", onlineUsers);
    });

    console.log("Online users:", onlineUsers);
  });
};

dbReady
  .then(async () => {
    await adminSeeder();
    await categoryController.seedCategory();
    await productController.seedProduct();

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
      console.log(`Server has started at port ${PORT}`);
    });

    const io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:3000",
          "http://localhost:5173",
          "http://localhost:5174",
        ],
        credentials: true,
      },
    });

    attachSocketHandlers(io);

    console.log(`Socket server started at port ${PORT}`);
  })
  .catch((err) => {
    console.error("Failed to start server: database not ready", err);

    process.exit(1);
  });
