import e from "express";
import * as ownerDto from "../dtos/auth.dto";
import { RegisterLabData } from "../types/auth.type";

export function MapRegisterLab(dto: ownerDto.RegisterLabDTO): RegisterLabData {
  return {
    // Section 1
    labName: dto.labName,
    labType: dto.labType,
    registrationNumber: dto.registrationNumber,
    labEmail: dto.labEmail,
    labPhone: dto.labPhone,

    // Section 2
    address1: dto.address1,
    address2: dto.address2,
    city: dto.city,
    state: dto.state,
    country: dto.country,
    postalCode: dto.postalCode,

    // Section 3
    ownerName: dto.ownerName,
    ownerEmail: dto.ownerEmail,
    ownerPhone: dto.ownerPhone,

    // Section 4
    password: dto.password,

    // Section 6
    agreeTerms: dto.agreeTerms,
  };
}

export function MapLogin(dto: ownerDto.LoginDTO) {
  return {
    email: dto.email,
    password: dto.password,
  };
}

export function MapVerifyEmail(dto: ownerDto.VerifyEmailDTO) {
  return {
    token: dto.token,
  };
}

export function MapRefreshToken(dto: ownerDto.RefreshTokenDTO) {
  return {
    refreshToken: dto.refreshToken,
  };
}

export function MapResendEmailVerification(
  dto: ownerDto.ResendEmailVerificationDTO,
) {
  return {
    email: dto.email,
  };
}

export function MapForgotPassword(dto: ownerDto.ForgotPasswordDTO) {
  return {
    email: dto.email,
  };
}

export function MapResetPassword(dto: ownerDto.ResetPasswordDTO) {
  return {
    password: dto.newPassword,
    resetToken: dto.token,
  };
}
