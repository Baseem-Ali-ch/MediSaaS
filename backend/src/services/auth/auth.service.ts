import { RegisterLabDTO } from "../../dtos/auth.dto";
import { hashPassword } from "../../utils/password";
import {
  generateEmailToken,
  generateToken,
  verifyToken,
} from "../../utils/token";
import crypto from "crypto";
import { sendVerificationUrl } from "../shared.service";
import { RegisterLabData } from "../../types/auth.type";
import { LabRepository } from "../../repositories/lab.repository";
import { UserRepository } from "../../repositories/user.repository";
import { BranchRepository } from "../../repositories/branch.repository";
import e from "express";
import { prisma } from "../../lib/prisma";

const labRepo = new LabRepository(prisma);
const userRepo = new UserRepository(prisma);
const branchRepo = new BranchRepository(prisma);

export const registerLab = async (data: RegisterLabData) => {
  const existingLab = await labRepo.findByEmail(data.labEmail);
  if (existingLab) {
    throw new Error("This email is already registered");
  }

  const hashedPassword = await hashPassword(data.password);

  let verificationToken = generateEmailToken();
  verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const lab = await labRepo.create({
    name: data.labName,
    email: data.labEmail,
    phone: data.labPhone,
    registrationNo: data.registrationNumber,
    address1: data.address1,
    address2: data.address2,
    city: data.city,
    state: data.state,
    country: data.country,
    postalCode: data.postalCode,
  });

  const branch = await branchRepo.create({
    name: "Main Branch",
    email: data.labEmail,
    phone: data.labPhone,
    address: data.address1,
    city: data.city,
    state: data.state,
    country: data.country,
    lab: { connect: { id: lab.id } },
  });

  const user = await userRepo.create({
    name: data.ownerName,
    email: data.ownerEmail,
    phone: data.ownerPhone,
    password: hashedPassword,
    role: "admin",
    emailVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    lab: { connect: { id: lab.id } },
    branch: {connect: {id: branch.id}}
  });

  

  await sendVerificationUrl(data.labEmail, verificationToken);
};

export const verifyEmail = async (data: { token: string }) => {
  const user = await userRepo.findByToken(data.token);
  if (!user) {
    throw new Error("Invalid verification token");
  }

  await userRepo.update(user.id, { emailVerified: true, emailVerificationToken: null });

  const accessToken = generateToken({ userId: user.id }, "15m");
  const refreshToken = generateToken({ userId: user.id }, "7d");

  return { user, accessToken, refreshToken };
};


export const refreshToken = async (data: { refreshToken: string }) => {
  if (!data.refreshToken) {
    throw new Error("Refresh token is required");
  }

  const decoded = verifyToken(data.refreshToken, process.env.JWT_SECRET!);

  const accessToken = generateToken({ userId: (decoded as any).userId }, "15m");
  const refreshToken = generateToken({ userId: (decoded as any).userId }, "7d");

  return { accessToken, refreshToken };
};
