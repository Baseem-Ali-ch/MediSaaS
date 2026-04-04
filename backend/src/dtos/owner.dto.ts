export class UpdateProfileDTO {
  name?: string;
  phone?: string;

  constructor(data: Partial<UpdateProfileDTO>) {
    this.name = data.name || "";
    this.phone = data.phone || "";
  }
}

export class ChangePasswordDTO {
  current: string;
  new: string;

  constructor(data: Partial<ChangePasswordDTO>) {
    this.current = data.current || "";
    this.new = data.new || "";
  }
}

export class UpdateLabDTO {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  constructor(data: Partial<UpdateLabDTO>) {
    this.name = data.name || "";
    this.email = data.email || "";
    this.phone = data.phone || "";
    this.address1 = data.address1 || "";
    this.address2 = data.address2 || "";
    this.city = data.city || "";
    this.state = data.state || "";
    this.country = data.country || "";
    this.postalCode = data.postalCode || "";
  }
}

export class BranchDTO {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  status?: string;
  isMain?: boolean;

  constructor(data: Partial<BranchDTO>) {
    if (data.id !== undefined) this.id = Number(data.id); // convert to number
    if (data.name !== undefined) this.name = data.name;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    if (data.city !== undefined) this.city = data.city;
    if (data.state !== undefined) this.state = data.state;
    if (data.country !== undefined) this.country = data.country;
    if (data.status !== undefined) this.status = data.status;
    if (data.isMain !== undefined) this.isMain = data.isMain === true;
  }
}

export class StaffDTO {
  id?: number;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  branch: string;
  gender: string;
  photo?: string;
  status: string;

  constructor(data: Partial<StaffDTO>) {
    if (data.id !== undefined) this.id = Number(data.id);
    this.staffId = data.staffId || "";
    this.name = data.name || "";
    this.email = data.email || "";
    this.phone = data.phone || "";
    this.role = data.role || "";
    this.branch = data.branch
      ? typeof data.branch === "string"
        ? data.branch
        : String(data.branch)
      : "";
    this.gender = data.gender || "";
    this.photo = data.photo || "";
    this.status = data.status || "";
  }
}
