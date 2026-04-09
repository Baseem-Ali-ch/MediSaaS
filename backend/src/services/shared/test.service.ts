import { prisma } from "../../lib/prisma";
import { logActivity } from "../shared.service";
import { TestRepository } from "../../repositories/test.repository";
import { UserRepository } from "../../repositories/user.repository";
import { BranchRepository } from "../../repositories/branch.repository";
import { CreateTestDTO, UpdateTestDTO } from "../../dtos/test.dto";

const testRepo = new TestRepository(prisma);
const userRepo = new UserRepository(prisma);
const branchRepo = new BranchRepository(prisma);

export const getTests = async (userId: number) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  return testRepo.getTests(user.labId!);
};

export const getTestById = async (userId: number, testId: number) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const test = await testRepo.findById(testId);
  if (!test || test.labId !== user.labId)
    throw new Error("Test not found");

  return test;
};

export const createTest = async (
  userId: number,
  data: CreateTestDTO,
  ipAddress: string | null
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const dataToCreate: any = { ...data };
  
  if (dataToCreate.parameters) {
    dataToCreate.parameters = JSON.stringify(dataToCreate.parameters);
  } else {
    dataToCreate.parameters = JSON.stringify([]);
  }

  const test = await testRepo.create({
    ...dataToCreate,
    lab: { connect: { id: user.labId } },
    ...(user.branchId && { branch: { connect: { id: user.branchId } } }),
  } as any);

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "TEST_CREATED",
    entity: "Test",
    message: `${user.email} created a new test: ${test.testName}`,
    metadata: {
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return test;
};

export const updateTest = async (
  userId: number,
  testId: number,
  data: UpdateTestDTO,
  ipAddress: string | null
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const test = await testRepo.findById(testId);
  if (!test || test.labId !== user.labId)
    throw new Error("Test not found");

  const dataToUpdate: any = { ...data };
  
  if (dataToUpdate.parameters) {
    dataToUpdate.parameters = JSON.stringify(dataToUpdate.parameters);
  }

  const updatedTest = await testRepo.update(testId, dataToUpdate);

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "TEST_UPDATED",
    entity: "Test",
    message: `${user.email} updated test information for ${test.testName}`,
    metadata: {
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return updatedTest;
};

export const deleteTest = async (
  userId: number,
  testId: number,
  ipAddress: string | null
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const test = await testRepo.findById(testId);
  if (!test || test.labId !== user.labId)
    throw new Error("Test not found");

  const updatedTest = await testRepo.update(testId, {
    status: "SUSPENDED",
  });

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "TEST_SUSPENDED",
    entity: "Test",
    message: `${user.email} suspended test: ${test.testName}`,
    metadata: {
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return updatedTest;
};
