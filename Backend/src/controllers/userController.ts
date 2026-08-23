import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import User from "../database/models/User";
import { AuthRequest } from "../middleware/authMiddleware";

class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<void> {
    const { username, email, password, firstName, lastName } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        message: "Please provide username,email,password",
      });
      return;
    }
    const userFound = await User.findOne({ where: { email } });
    if (userFound) {
      res.status(409).json({
        message: "User with that email already exists",
      });
      return;
    }
    await User.create({
      username,
      email,
      password: await bcrypt.hash(password, 4),
      // Optional personal-details fields from the register form; not
      // required so existing/legacy clients keep working unchanged.
      firstName: firstName || null,
      lastName: lastName || null,
    });
    res.status(200).json({
      message: "User registered successfully",
    });
  }

  public static async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "please provide email and password" });
      return;
    }
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
    const isMatched = bcrypt.compareSync(password, data[0].password);
    if (!isMatched) {
      res.status(403).json({
        message: "Invalid email or password",
      });
      return;
    }
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

  public static async getProfile(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    res.status(200).json({
      message: "Profile fetched successfully",
      data: req.user,
    });
  }

  public static async updateUserRole(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !["admin", "customer"].includes(role)) {
      res.status(400).json({ message: "Please provide a valid role" });
      return;
    }
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "No user with that id" });
      return;
    }
    user.role = role;
    await user.save();
    res.status(200).json({
      message: "User role updated successfully",
      data: user,
    });
  }

  public static async requestPasswordReset(
    req: Request,
    res: Response
  ): Promise<void> {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Please provide email" });
      return;
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "No user with that email" });
      return;
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    await user.save();

    // NOTE: No email delivery service is wired up yet. In a production system this
    // token would be emailed to the user instead of being returned in the response.
    res.status(200).json({
      message: "Password reset token generated successfully",
      resetToken,
    });
  }

  public static async resetPassword(
    req: Request,
    res: Response
  ): Promise<void> {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ message: "Please provide token and newPassword" });
      return;
    }
    const user = await User.findOne({ where: { resetToken: token } });
    if (
      !user ||
      !user.resetTokenExpiry ||
      new Date(user.resetTokenExpiry) < new Date()
    ) {
      res.status(400).json({ message: "Invalid or expired reset token" });
      return;
    }
    user.password = await bcrypt.hash(newPassword, 4);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  }
}

export default AuthController;
