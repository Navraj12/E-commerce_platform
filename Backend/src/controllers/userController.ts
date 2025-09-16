import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import User from "../database/models/User";
import { AuthRequest } from "../middleware/authMiddleware";

/* The AuthController class in TypeScript provides a method to register a user with validation checks and password hashing. */
class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        message: "Please provide username,email,password",
      });
      return;
    }
    await User.create({
      username,
      email,
      password: await bcrypt.hash(password, 20),
    });
    res.status(200).json({
      message: "User registered successfully",
    });
  }

  public static async loginUser(req: Request, res: Response): Promise<void> {
    //user input
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "please provide email and password" });
      return;
    }
    //check whether user with above email exist or not
    const data = await User.findAll({
      where: {
        email: email,
      },
    });
    if (!data || data.length === 0) {
      res.status(404).json({
        message: "No user with that email",
      });
      return;
    }
    //check password now
    const isMatched = bcrypt.compareSync(password, data[0].password);
    if (!isMatched) {
      res.status(403).json({
        message: "Invalid email or password",
      });
      return;
    }
    //generate token
    const token = Jwt.sign(
      { id: data[0].id },
      process.env.SECRET_KEY as string,
      { expiresIn: "23d" }
    );
    res.status(200).json({
      message: "Logged in successfully",
      data: token,
    });
  }

  public static async fetchUsers(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    const users = await User.findAll();
    if (users.length > 0) {
      res.status(200).json({
        message: "order fetched successfully",
        data: users,
      });
    } else {
      res.status(404).json({
        message: "you haven't ordered anything yet..",
        data: [],
      });
    }
  }

  public static async deleteUser(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    const id = req.params.id;
    const users = await User.destroy({ where: { id } });
    res.status(200).json({
      message: "User deleted successfully",
    });
  }
}

export default AuthController;
