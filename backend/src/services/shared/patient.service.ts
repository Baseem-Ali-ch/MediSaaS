import { prisma } from "../../lib/prisma";
import { logActivity } from "../shared.service";
import { PatientRepository } from "../../repositories/patient.repository";
import { UserRepository } from "../../repositories/user.repository";
import { BranchRepository } from "../../repositories/branch.repository";
import {
  MapCreatePatient,
  MapUpdatePatient,
} from "../../mappers/patient.mapper";
import { CreatePatientDTO, UpdatePatientDTO } from "../../dtos/patient.dto";

const patientRepo = new PatientRepository(prisma);
const userRepo = new UserRepository(prisma);
const branchRepo = new BranchRepository(prisma);

export const getPatients = async (userId: number) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  return patientRepo.getPatients(user.labId);
};

export const getPatientById = async (userId: number, patientId: number) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const patient = await patientRepo.findById(patientId);
  if (!patient || patient.labId !== user.labId)
    throw new Error("Patient not found");

  return patient;
};

export const createPatient = async (
  userId: number,
  data: CreatePatientDTO,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const mappedData = MapCreatePatient(data);

  if (mappedData.branchId) {
    const branch = await branchRepo.findById(mappedData.branchId);
    if (!branch) throw new Error("Branch not found");
    if (branch.labId !== user.labId)
      throw new Error("Branch does not belong to your lab");
  }

  const existing = await patientRepo.findByPhone(mappedData.phone);
  if (existing && existing.labId === user.labId) {
    throw new Error(
      "Patient with this phone number already exists in your lab",
    );
  }

  const count = await prisma.patient.count({ where: { labId: user.labId } });
  const refId = `PAT-${String(count + 1).padStart(5, "0")}`;

  const { branchId, ...patientData } = mappedData;

  const patient = await patientRepo.create({
    ...patientData,
    refId: refId,
    lab: { connect: { id: user.labId } },
    ...(branchId && { branch: { connect: { id: branchId } } }),
  } as any);

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "PATIENT_CREATED",
    entity: "Patient",
    message: `${user.email} created a new patient: ${patient.name} (${patient.phone})`,
    metadata: {
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return patient;
};

export const updatePatient = async (
  userId: number,
  patientId: number,
  data: UpdatePatientDTO,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const patient = await patientRepo.findById(patientId);
  if (!patient || patient.labId !== user.labId)
    throw new Error("Patient not found");

  const mappedData = MapUpdatePatient(data);

  if (mappedData.branchId) {
    const branch = await branchRepo.findById(mappedData.branchId);
    if (!branch) throw new Error("Branch not found");
    if (branch.labId !== user.labId)
      throw new Error("Branch does not belong to your lab");
  }

  if (mappedData.phone) {
    const existing = await patientRepo.findByPhone(mappedData.phone);
    if (
      existing &&
      existing.id !== patientId &&
      existing.labId === user.labId
    ) {
      throw new Error("Another patient with this phone number already exists");
    }
  }

  const updatedPatient = await patientRepo.update(patientId, mappedData);

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "PATIENT_UPDATED",
    entity: "Patient",
    message: `${user.email} updated patient information for ${patient.name}`,
    metadata: {
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return updatedPatient;
};

export const deletePatient = async (
  userId: number,
  patientId: number,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const patient = await patientRepo.findById(patientId);
  if (!patient || patient.labId !== user.labId)
    throw new Error("Patient not found");

  const updatedPatient = await patientRepo.update(patientId, {
    status: "SUSPENDED",
  });

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "PATIENT_SUSPENDED",
    entity: "Patient",
    message: `${user.email} suspended patient: ${patient.name}`,
    metadata: {
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return updatedPatient;
};
