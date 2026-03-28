export class UpdateProfileDTO {
  name?: string;
  phone?: string;

  constructor(data: Partial<UpdateProfileDTO>) {
    this.name = data.name || "";
    this.phone = data.phone || "";
  }
}

export class ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;

  constructor(data: Partial<ChangePasswordDTO>) {
    this.currentPassword = data.currentPassword || "";
    this.newPassword = data.newPassword || "";
  }
}
