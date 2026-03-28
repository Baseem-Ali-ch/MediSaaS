import { Request, Response, NextFunction } from "express";
import * as profileService from "../../services/admin/profile.service";
import logger from "../../config/logger";
import * as adminDto from "../../dtos/admin.dto";
import * as adminMap from "../../mappers/admin.mapper";

export const getProfile = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await profileService.getProfile(userId);
    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      user: result,
    });
  } catch (error) {
    logger.error("[Controller] Get Profile", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const udpateProfile = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const dto = new adminDto.UpdateProfileDTO(req.body);
    const data = adminMap.MapUpdateProfile(dto);

    const result = await profileService.updateProfile(userId, data);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: result,
    });
  } catch (error) {
    logger.error("[Controller] Update Profile", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const changePassword = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try{
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

      const dto = new adminDto.ChangePasswordDTO(req.body);
      const data = adminMap.MapChangePassword(dto);
      await profileService.changePassword(userId, data);
      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
  }catch(error){
    logger.error("[Controller] Change Password", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
