import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger";
import * as labService from "../../services/admin/lab.service";
import * as adminDto from "../../dtos/admin.dto";
import * as adminMap from "../../mappers/admin.mapper";

export const getLab = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await labService.getLab(userId);
    res.status(200).json({
      success: true,
      message: "Lab retrieved successfully",
      data: result,
    });
  } catch (error) {
    logger.error("[Controller] Get Lab", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateLab = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const dto = new adminDto.UpdateLabDTO(req.body);
    const data = adminMap.MapUpdateLab(dto);

    const result = await labService.updateLab(userId, data);
    res.status(200).json({
      success: true,
      message: "Lab updated successfully",
      data: result,
    });
  } catch (error) {
    logger.error("[Controller] Update Lab", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
