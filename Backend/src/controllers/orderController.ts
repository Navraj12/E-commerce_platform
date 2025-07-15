import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

class OrderController{
async createOrder(req:AuthRequest,res:Response):Promise<void>{

const {phoneNumber,shippingAddress,totalAmount,PaymentDetails,items} =req.body
}
}