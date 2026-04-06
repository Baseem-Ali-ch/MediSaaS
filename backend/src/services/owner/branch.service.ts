import { Branch } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { BranchRepository } from "../../repositories/branch.repository";
import { UserRepository } from "../../repositories/user.repository";
import { logActivity } from "../shared.service";

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
  ipAddress: string | null,
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

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "BRANCH_CREATED",
    entity: "Branch",
    message: `${user.email} created a new branch: ${branch.name}`,
    metadata: {
      name: user.name,
      email: user.email,
      role: user.role,
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return branch;
};

export const updateBranch = async (
  userId: number,
  branchId: number,
  data: Partial<Branch>,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const branch = await branchRepo.findById(branchId);
  if (!branch) throw new Error("Branch not found");
  if (branch.labId !== user.labId) throw new Error("Unauthorized");

  const updatedBranch = await branchRepo.update(branchId, data);

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "BRANCH_UPDATED",
    entity: "Branch",
    message: `${user.email} updated branch information for ${branch.name}`,
    metadata: {
      name: user.name,
      email: user.email,
      role: user.role,
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });
  return updatedBranch;
};

export const deleteBranch = async (
  userId: number,
  branchId: number,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const branch = await branchRepo.findById(branchId);
  if (!branch) throw new Error("Branch not found");
  if (branch.labId !== user.labId) throw new Error("Unauthorized");
  if (branch.isMain) throw new Error("Cannot delete the main branch");

  await branchRepo.delete(branchId);

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "BRANCH_DELETED",
    entity: "Branch",
    message: `${user.email} deleted branch: ${branch.name}`,
    metadata: {
      name: user.name,
      email: user.email,
      role: user.role,
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });
};
