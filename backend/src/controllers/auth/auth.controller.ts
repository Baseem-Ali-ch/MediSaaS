import { Request, Response, NextFunction } from "express";
import * as authService from "../../services/auth/auth.service";
import logger from "../../config/logger";
import * as authDto from "../../dtos/auth.dto";
import * as authMap from "../../mappers/auth.mapper";

export const registerLab = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = new authDto.RegisterLabDTO(req.body);
    const data = authMap.MapRegisterLab(dto);
    await authService.registerLab(data);
    res
      .status(200)
      .json({ success: true, message: "Lab registered successfully" });
  } catch (error) {
    logger.error("[Controller] Register Lab", error);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ipAddress =
      req.ip ?? (req.headers["x-forwarded-for"] as string) ?? null;
    const dto = new authDto.LoginDTO(req.body);
    const data = authMap.MapLogin(dto);
    const result = await authService.login(data, ipAddress);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        token: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      },
    });
  } catch (error) {
    logger.error("[Controller] Login", error);
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ipAddress =
      req.ip ?? (req.headers["x-forwarded-for"] as string) ?? null;
    const dto = new authDto.VerifyEmailDTO(req.query);
    const data = authMap.MapVerifyEmail(dto);
    const result = await authService.verifyEmail(data, ipAddress);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        user: result.user,
        token: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      },
    });
  } catch (error) {
    logger.error("[Controller] Verify Email", error);
    next(error);
  }
};

export const resendEmailVerificationToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = new authDto.ResendEmailVerificationDTO(req.body);
    const data = authMap.MapResendEmailVerification(dto);
    await authService.resendEmailVerificationToken(data);
    res.status(200).json({
      success: true,
      message: "Email verification token sent successfully",
    });
  } catch (error) {
    logger.error("[Controller] Resend Email Verification Token", error);
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = new authDto.ForgotPasswordDTO(req.body);
    const data = authMap.MapForgotPassword(dto);
    await authService.forgotPassword(data);
    res.status(200).json({
      success: true,
      message: "Password reset token sent successfully",
    });
  } catch (error) {
    logger.error("[Controller] Forgot Password", error);
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ipAddress =
      req.ip ?? (req.headers["x-forwarded-for"] as string) ?? null;
    const dto = new authDto.ResetPasswordDTO(req.body, req.query);
    const data = authMap.MapResetPassword(dto);
    await authService.resetPassword(data, ipAddress);
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    logger.error("[Controller] Reset Password", error);
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = new authDto.RefreshTokenDTO(req.body);
    const data = authMap.MapRefreshToken(dto);
    const tokens = await authService.refreshToken(data);
    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      token: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    logger.error("[Controller] Refresh Token", error);
    next(error);
  }
};
