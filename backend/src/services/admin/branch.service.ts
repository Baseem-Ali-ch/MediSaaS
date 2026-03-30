import { Branch } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { BranchRepository } from "../../repositories/branch.repository";
import { UserRepository } from "../../repositories/user.repository";

const userRepo = new UserRepository(prisma);
const branchRepo = new BranchRepository(prisma);

export const getBranches = async (userId: number) => {
  const branches = await userRepo.getBranchesByUserId(userId);
  if (!branches.length) throw new Error("No branches found");
  return branches;
};

export const createBranch = async (
  userId: number,
  data: Omit<Branch, "id" | "createdAt" | "updatedAt" | "labId">,
) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const branch = await branchRepo.create({
    ...data,
    lab: {
      connect: { id: user.labId },
    },
  });

  await userRepo.update(userId, {
    branch: {
      connect: { id: branch.id },
    },
  });

  return branch;
};

export const updateBranch = async (
  userId: number,
  branchId: number,
  data: Partial<Branch>,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const branch = await branchRepo.findById(branchId);
  if (!branch) throw new Error("Branch not found");
  if (branch.labId !== user.labId) throw new Error("Unauthorized");

  return branchRepo.update(branchId, data);
};

export const deleteBranch = async (userId: number, branchId: number) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const branch = await branchRepo.findById(branchId);
  if (!branch) throw new Error("Branch not found");
  if (branch.labId !== user.labId) throw new Error("Unauthorized");
  if (branch.isMain) throw new Error("Cannot delete the main branch");

  return branchRepo.delete(branchId);
};
