export class PatientDTO {
  id?: number;
  refId?: string;
  name: string;
  phone: string;
  gender?: string;
  dateOfBirth?: Date;
  age?: number;
  address?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  notes?: string;
  status?: string;
  branchId?: number;

  constructor(data: any) {
    this.id = data.id;
    this.refId = data.refId;
    this.name = data.name || "";
    this.phone = data.phone || "";
    this.gender = data.gender;
    this.dateOfBirth = data.dateOfBirth;
    this.age = data.age;
    this.address = data.address;
    this.bloodGroup = data.bloodGroup;
    this.emergencyContact = data.emergencyContact;
    this.notes = data.notes;
    this.status = data.status;
    this.branchId = data.branchId;
  }
}

export class CreatePatientDTO {
  name: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  age?: number;
  address?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  notes?: string;
  branchId?: number;

  constructor(data: any) {
    this.name = data.name;
    this.phone = data.phone;
    this.gender = data.gender;
    this.dateOfBirth = data.dateOfBirth;
    this.age = data.age ? Number(data.age) : undefined;
    this.address = data.address;
    this.bloodGroup = data.bloodGroup;
    this.emergencyContact = data.emergencyContact;
    this.notes = data.notes;
    this.branchId = data.branchId ? Number(data.branchId) : undefined;
  }
}

export class UpdatePatientDTO {
  name?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  age?: number;
  address?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  notes?: string;
  status?: string;
  branchId?: number;

  constructor(data: any) {
    this.name = data.name;
    this.phone = data.phone;
    this.gender = data.gender;
    this.dateOfBirth = data.dateOfBirth;
    this.age = data.age ? Number(data.age) : undefined;
    this.address = data.address;
    this.bloodGroup = data.bloodGroup;
    this.emergencyContact = data.emergencyContact;
    this.notes = data.notes;
    this.status = data.status;
    this.branchId = data.branchId ? Number(data.branchId) : undefined;
  }
}
