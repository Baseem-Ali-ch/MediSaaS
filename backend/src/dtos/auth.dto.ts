export class RegisterLabDTO {
  labName: string;
  labType: string;
  registrationNumber: string;
  labEmail: string;
  labPhone: string;

  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;

  password: string;

  agreeTerms: boolean;

  constructor(data: Partial<RegisterLabDTO>) {
    this.labName = data.labName?.trim() || "";
    this.labType = data.labType || "";
    this.registrationNumber = data.registrationNumber || "";
    this.labEmail = data.labEmail?.trim().toLowerCase() || "";
    this.labPhone = data.labPhone || "";

    this.address1 = data.address1?.trim() || "";
    this.address2 = data.address2?.trim() || "";
    this.city = data.city?.trim() || "";
    this.state = data.state?.trim() || "";
    this.country = data.country?.trim() || "";
    this.postalCode = data.postalCode?.trim() || "";

    this.ownerName = data.ownerName?.trim() || "";
    this.ownerEmail = data.ownerEmail?.trim().toLowerCase() || "";
    this.ownerPhone = data.ownerPhone || "";

    this.password = data.password || "";

    this.agreeTerms = data.agreeTerms || false;
  }
}

export class LoginDTO {
  email: string;
  password: string;

  constructor(data: Partial<LoginDTO>) {
    this.email = data.email?.trim().toLowerCase() || "";
    this.password = data.password || "";
  }
}

export class VerifyEmailDTO {
  token: string;

  constructor(data: Partial<VerifyEmailDTO>) {
    this.token = data.token || "";
  }
}

export class RefreshTokenDTO {
  refreshToken: string;
  constructor(data: Partial<RefreshTokenDTO>) {
    this.refreshToken = data.refreshToken || "";
  }
}

export class ResendEmailVerificationDTO {
  email: string;

  constructor(data: Partial<ResendEmailVerificationDTO>) {
    this.email = data.email?.trim().toLowerCase() || "";
  }
}

export class ForgotPasswordDTO {
  email: string;

  constructor(data: Partial<ForgotPasswordDTO>) {
    this.email = data.email?.trim().toLowerCase() || "";
  }
}

export class ResetPasswordDTO {
  newPassword: string;
  token: string;

  constructor(body: any, query: any) {
    this.newPassword = body.newPassword || "";
    this.token = (query.token as string) || "";
  }
}
