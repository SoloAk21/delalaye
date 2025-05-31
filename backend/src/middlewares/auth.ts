import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any; // modify this to proper type
}
export default async function (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  //Get token from header
  const token = req.header("x-auth-token");

  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret!) as JwtPayload;

    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
}
