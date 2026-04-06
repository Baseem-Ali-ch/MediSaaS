import { NextFunction } from "express";
import logger from "../../config/logger";
import { UserRepository } from "../../repositories/user.repository";
import { prisma } from "../../lib/prisma";
import { User } from "@prisma/client";
import { hashPassword } from "../../utils/password";
import { logActivity } from "../shared.service";

const userRepo = new UserRepository(prisma);

export const getProfile = async (userId: number) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateProfile = async (
  userId: number,
  data: Partial<User>,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await userRepo.update(userId, data);
  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "PROFILE_UPDATE",
    entity: "User",
    message: `${user.email} updated their profile`,
    metadata: {
      name: user.name,
      email: user.email,
      role: user.role,
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return updatedUser;
};

export const changePassword = async (
  userId: number,
  data: { currentPassword: string; newPassword: string },
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await userRepo.comparePassword(userId, data.currentPassword);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await hashPassword(data.newPassword);

  await userRepo.update(userId, { password: hashedPassword });
  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "PROFILE_UPDATE",
    entity: "User",
    message: `${user.email} reset their password`,
    metadata: {
      name: user.name,
      email: user.email,
      role: user.role,
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });
  return;
};
