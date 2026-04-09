import { Patient } from "@prisma/client";
import { PatientDTO, CreatePatientDTO, UpdatePatientDTO } from "../dtos/patient.dto";

export function MapPatientToDTO(patient: Patient): PatientDTO {
  return new PatientDTO({
    id: patient.id,
    refId: patient.refId,
    name: patient.name,
    phone: patient.phone,
    gender: patient.gender,
    dateOfBirth: patient.dateOfBirth,
    age: patient.age,
    address: patient.address,
    bloodGroup: patient.bloodGroup,
    emergencyContact: patient.emergencyContact,
    notes: patient.notes,
    status: patient.status,
    branchId: patient.branchId,
  });
}

export function MapCreatePatient(dto: CreatePatientDTO) {
  return {
    name: dto.name,
    phone: dto.phone,
    gender: dto.gender,
    dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    age: dto.age,
    address: dto.address,
    bloodGroup: dto.bloodGroup,
    emergencyContact: dto.emergencyContact,
    notes: dto.notes,
    branchId: dto.branchId,
  };
}

export function MapUpdatePatient(dto: UpdatePatientDTO) {
  const data: any = {};
  if (dto.name !== undefined) data.name = dto.name;
  if (dto.phone !== undefined) data.phone = dto.phone;
  if (dto.gender !== undefined) data.gender = dto.gender;
  if (dto.dateOfBirth !== undefined)
    data.dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : null;
  if (dto.age !== undefined) data.age = dto.age;
  if (dto.address !== undefined) data.address = dto.address;
  if (dto.bloodGroup !== undefined) data.bloodGroup = dto.bloodGroup;
  if (dto.emergencyContact !== undefined) data.emergencyContact = dto.emergencyContact;
  if (dto.notes !== undefined) data.notes = dto.notes;
  if (dto.status !== undefined) data.status = dto.status;
  if (dto.branchId !== undefined) data.branchId = dto.branchId;
  return data;
}
