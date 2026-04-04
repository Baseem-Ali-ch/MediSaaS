import { Request, Response } from "express";
import * as staffService from "../../services/owner/staff.service";
import logger from "../../config/logger";
import * as ownerDto from "../../dtos/owner.dto";
import * as ownerMap from "../../mappers/owner.mapper";

export const getStaff = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const staff = await staffService.getStaff(userId);
    res.json({ success: true, data: staff });
  } catch (error) {
    logger.error("[Controller] Error fetching staff:", error);
    res.status(500).json({ success: false, message: "Failed to fetch staff" });
  }
};

export const createStaff = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    const dto = new ownerDto.StaffDTO(req.body);
    const data = ownerMap.MapCreateStaff(dto);
    const staff = await staffService.createStaff(userId, data);
    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: staff,
    });
  } catch (error) {
    logger.error("[Controller] Error creating staff:", error);
    res.status(500).json({ success: false, message: "Failed to create staff" });
  }
};

export const updateStaff = async (req: any, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const staffId = Number(req.params.staffId);
  const dto = new ownerDto.StaffDTO(req.body);
  const data = ownerMap.MapCreateStaff(dto);
  const staff = await staffService.updateStaff(userId, staffId, data);
  res.json({ success: true, data: staff });
};

export const deleteStaff = async (req: any, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const staffId = Number(req.params.staffId);

  await staffService.deleteStaff(userId, staffId);
  res.json({ success: true, message: "Staff deleted successfully" });
};
