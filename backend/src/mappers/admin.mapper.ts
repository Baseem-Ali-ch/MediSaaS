import * as adminDto from "../dtos/admin.dto";

export function MapUpdateProfile(dto: adminDto.UpdateProfileDTO) {
  return {
    name: dto.name,
    phone: dto.phone,
  };
}

export function MapChangePassword(dto: adminDto.ChangePasswordDTO) {
  return {
    currentPassword: dto.current,
    newPassword: dto.new,
  };
}

export function MapUpdateLab(dto: adminDto.UpdateLabDTO) {
  return {
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    address1: dto.address1,
    address2: dto.address2,
    city: dto.city,
    state: dto.state,
    country: dto.country,
    postalCode: dto.postalCode
  };
}

export function MapCreateBranch(dto: adminDto.BranchDTO) {
  if (!dto.name || !dto.email || !dto.phone || !dto.city || !dto.state || !dto.country) {
    throw new Error("Missing required fields: name, email, phone, city, state, country");
  }

  return {
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    address: dto.address ?? null,
    city: dto.city,
    state: dto.state,
    country: dto.country,
    status: dto.status ?? 'Active',
    isMain: dto.isMain ?? false,
  };
}

export function MapUpdateBranch(dto: adminDto.BranchDTO): Partial<{
  name: string;
  email: string;
  phone: string;
  address: string | null;
  city: string;
  state: string;
  country: string;
}> {
  const data: any = {};

  if (dto.name !== undefined) data.name = dto.name;
  if (dto.email !== undefined) data.email = dto.email;
  if (dto.phone !== undefined) data.phone = dto.phone;
  if (dto.address !== undefined) data.address = dto.address;
  if (dto.city !== undefined) data.city = dto.city;
  if (dto.state !== undefined) data.state = dto.state;
  if (dto.country !== undefined) data.country = dto.country;

  return data;
}
