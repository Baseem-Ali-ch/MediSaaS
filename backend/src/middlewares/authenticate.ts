import { NextFunction, Response, Request } from "express";
import { verifyToken } from "../utils/token";
import { prisma } from "../lib/prisma";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET!) as { userId: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, labId: true, branchId: true, status: true },
    });

    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.status === "SUSPENDED")
      return res.status(403).json({ message: "Account suspended" });

    (req as any).user = user; // { id, role, labId, branchId, status }
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Invalid token", error: "jwt expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};
