import { NextFunction, Response, Request } from "express";
import { verifyToken } from "../utils/token";
import { error } from "node:console";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (err: Error | any) {
    return res.status(403).json({ message: "Invalid token", error: err.message });
  }
};
