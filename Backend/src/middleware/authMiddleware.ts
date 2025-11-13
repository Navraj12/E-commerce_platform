import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../database/models/User";

export interface AuthRequest extends Request {
  user?: {
    username: string;
    email: string;
    role: string;
    password?: string;
    id: string;
  };
}

interface DecodedToken {
  username: string;
  email: string;
  role: string;
  password?: string;
  id: string;
}

enum Role {
  Admin = "admin",
  Customer = "customer",
}

class AuthMiddleware {
  async isAuthenticated(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let token = req.headers.authorization;

    if (!token) {
      res.status(403).json({ message: "Token is not provided" });
      return;
    }

    // Remove "Bearer " prefix
    // if (token.startsWith("Bearer ")) {
    //   token = token.slice(7, token.length).trim();
    // }

    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid Token" });
        }

        try {
          const decodedToken = decoded as DecodedToken;
          const userData = await User.findByPk(decodedToken.id);
          if (!userData) {
            return res.status(404).json({ message: "No user with that token" });
          }

          req.user = userData;
          next();
        } catch (error) {
          return res.status(500).json({ message: "Something went wrong" });
        }
      }
    );
  }

  restrictTo(...roles: Role[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      const userRole = req.user?.role as Role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          message: "You do not have permission to perform this action",
        });
      }
      next();
    };
  }
}

export default new AuthMiddleware();
export { Role };
