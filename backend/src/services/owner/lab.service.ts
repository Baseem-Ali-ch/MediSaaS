import { Lab } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRepository } from "../../repositories/user.repository";
import { LabRepository } from "../../repositories/lab.repository";
import { logActivity } from "../shared.service";

const userRepo = new UserRepository(prisma);
const labRepo = new LabRepository(prisma);

export const getLab = async (userId: number) => {
  const lab = await userRepo.getLabByUserId(userId);
  if (!lab) throw new Error("Lab not found");
  return lab;
};

export const updateLab = async (userId: number, data: Partial<Lab>, ipAddress: string | null) => {
  const lab = await userRepo.getLabByUserId(userId);
  if (!lab) {
    throw new Error("Lab not found");
  }

  const user = await userRepo.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const updatedLab = await labRepo.update(userId, data);

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "LAB_UPDATED",
    entity: "Lab",
    message: `${user.email} updated their lab information`,
    metadata: {
      name: user.name,
      email: user.email,
      role: user.role,
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return updatedLab;
};
