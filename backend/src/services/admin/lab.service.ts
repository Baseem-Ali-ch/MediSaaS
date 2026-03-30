import { Lab } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRepository } from "../../repositories/user.repository";
import { LabRepository } from "../../repositories/lab.repository";

const userRepo = new UserRepository(prisma);
const labRepo = new LabRepository(prisma);

export const getLab = async (userId: number) => {
  const lab = await userRepo.getLabByUserId(userId);
  if (!lab) throw new Error("Lab not found");
  return lab;
};

export const updateLab = async (userId: number, data: Partial<Lab>) => {
    const result = await userRepo.getLabByUserId(userId);
    if (!result) {
      throw new Error("Lab not found");
    }

    const updatedLab = await labRepo.update(userId, data);
    return updatedLab;
};
