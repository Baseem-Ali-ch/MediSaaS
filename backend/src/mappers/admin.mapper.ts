import * as adminDto from "../dtos/admin.dto";

export function MapUpdateProfile(dto: adminDto.UpdateProfileDTO) {
  return {
    // Section 1
    name: dto.name,
    phone: dto.phone,
  };
}

export function MapChangePassword(dto: adminDto.ChangePasswordDTO) {
  return {
    // Section 1
    currentPassword: dto.currentPassword,
    newPassword: dto.newPassword,
  };
}
