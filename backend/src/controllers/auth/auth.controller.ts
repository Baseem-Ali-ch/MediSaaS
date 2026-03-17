import { Request, Response, NextFunction } from "express";
import * as authService from "../../services/auth/auth.service";
import logger from "../../config/logger";
import * as authDto from "../../dtos/auth.dto";
import * as authMap from "../../mappers/auth/auth.mapper";

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

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = new authDto.VerifyEmailDTO(req.query);
    const data = authMap.MapVerifyEmail(dto);
    const result = await authService.verifyEmail(data);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      },
    });
  } catch (error) {
    logger.error("[Controller] Verify Email", error);
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
