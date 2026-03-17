import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (
  payload: JwtPayload | Record<string, any>,
  expiresIn: SignOptions["expiresIn"]
): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
};

export const verifyToken = (token: string, secret: string): object | string => {
  return jwt.verify(token, secret);
};

export const generateEmailToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
