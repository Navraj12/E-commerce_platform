import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../database/models/User";

export interface AuthRequest extends Request {
  user?: {
    username: string;
    email: string;
    role: string;
    password: string;
    id: string;
  };
}

interface DecodedToken {
  username: string;
  email: string;
  role: string;
  password: string;
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
    //get token from user
    const token = req.headers.authorization;
    if (!token || token === undefined) {
      res.status(403).json({
        message: "Token is not provided",
      });
      return;
    }
    //verify token if it is legit or tampered
    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      async (err, decoded) => {
        if (err) {
          res.status(403).json({
            message: "Invalid Token",
          });
        } else {
          //check if that decoded object id user exist or not
          try {
            const decodedToken = decoded as DecodedToken;
            const userData = await User.findByPk(decodedToken.id);
            if (!userData) {
              res.status(404).json({
                message: "No user with that token",
              });
              return;
            }
            req.user = userData;
            next();
          } catch (error) {
            res.status(500).json({
              message: "something went wrong",
            });
          }
        }
      }
    );
  }

  restictTo(...roles: Role[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      let userRole = req.user?.role as Role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          message: "You do not have permission to perform this action",
        });
      } else {
        next();
      }
    };
  }
}
export default new AuthMiddleware(); // default export
export { Role }; // named export ✅
// Export types for use in other files
