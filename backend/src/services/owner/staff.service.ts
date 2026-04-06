import { prisma } from "../../lib/prisma";
import { UserRepository } from "../../repositories/user.repository";
import { BranchRepository } from "../../repositories/branch.repository";
import { User } from "@prisma/client";
import { generateEmailToken } from "../../utils/token";
import crypto from "crypto";
import { logActivity, sendInvitationEmail } from "../shared.service";
import { CreateStaffInput } from "../../types/owner.type";
import { generatePassword, hashPassword } from "../../utils/password";

const userRepo = new UserRepository(prisma);
const branchRepo = new BranchRepository(prisma);

export const getStaff = async (userId: number) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  return userRepo.getStaff(user.labId);
};

export const createStaff = async (
  userId: number,
  data: CreateStaffInput,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "OWNER") throw new Error("Lab owner only can create staff");

  const existing = await userRepo.findByEmail(data.email);
  if (existing) throw new Error("Email already exists");

  if (data.branchId) {
    const branch = await branchRepo.findById(data.branchId);
    if (!branch) throw new Error("Branch not found");
    if (branch.labId !== user.labId)
      throw new Error("Branch does not belong to your lab");
  }

  let inviteToken = generateEmailToken();
  inviteToken = crypto.createHash("sha256").update(inviteToken).digest("hex");

  const count = await prisma.user.count({ where: { role: data.role } });

  const rolePrefix = data.role.substring(0, 3).toUpperCase();
  const refId = `${rolePrefix}-${String(count + 1).padStart(3, "0")}`;
  const password = generatePassword();
  const hashedPassword = await hashPassword(password);

  const staff = await userRepo.create({
    refId: refId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    gender: data.gender,
    photo: data.photo,
    lab: { connect: { id: user.labId } },
    ...(data.branchId && { branch: { connect: { id: data.branchId } } }),
    status: "INVITED",
    password: hashedPassword,
    inviteToken: inviteToken,
    inviteTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  await sendInvitationEmail(data.name, data.email, password, inviteToken);

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "STAFF_CREATED",
    entity: "User",
    message: `${user.email} created a new staff: ${staff.email}`,
    metadata: {
      name: user.name,
      email: user.email,
      role: user.role,
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return staff;
};

export const updateStaff = async (
  userId: number,
  staffId: number,
  data: Partial<User>,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "OWNER") throw new Error("Unauthorized");

  const staff = await userRepo.findById(staffId);
  if (!staff) throw new Error("Staff not found");
  if (staff.labId !== user.labId) throw new Error("Unauthorized");

  if (data.branchId) {
    const branch = await branchRepo.findById(data.branchId);
    if (!branch) throw new Error("Branch not found");
    if (branch.labId !== user.labId) throw new Error("Unauthorized");
  }

  const updatedStaff = await userRepo.update(staffId, data);

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "STAFF_UPDATED",
    entity: "User",
    message: `${user.email} updated staff information for ${staff.email}`,
    metadata: {
      name: user.name,
      email: user.email,
      role: user.role,
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return updatedStaff;
};

export const deleteStaff = async (
  userId: number,
  staffId: number,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "OWNER") throw new Error("Unauthorized");

  const staff = await userRepo.findById(staffId);
  if (!staff) throw new Error("Staff not found");
  if (staff.labId !== user.labId) throw new Error("Unauthorized");

  if (["OWNER", "SUPER_ADMIN"].includes(staff.role)) {
    throw new Error("Cannot delete this user");
  }

  const updatedStaff = await userRepo.update(staffId, { status: "SUSPENDED" });
  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "STAFF_SUSPENDED",
    entity: "User",
    message: `${user.email} suspended staff: ${staff.email}`,
    metadata: {
      name: user.name,
      email: user.email,
      role: user.role,
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return updatedStaff;
};
