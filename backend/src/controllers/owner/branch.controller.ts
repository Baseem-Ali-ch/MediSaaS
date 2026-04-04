import { Response, NextFunction } from "express";
import logger from "../../config/logger";
import * as branchService from "../../services/owner/branch.service";
import * as ownerDto from "../../dtos/owner.dto";
import * as ownerMap from "../../mappers/owner.mapper";

export const getBranch = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await branchService.getBranches(userId);
    res.status(200).json({
      success: true,
      message: "Branch retrieved successfully",
      data: result,
    });
  } catch (error) {
    logger.error("[Controller] Get Branch", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createBranch = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const dto = new ownerDto.BranchDTO(req.body);
    const data = ownerMap.MapCreateBranch(dto);
    const result = await branchService.createBranch(userId, data);
    res.status(200).json({
      success: true,
      message: "Branch created successfully",
      data: result,
    });
  } catch (error) {
    logger.error("[Controller] Create Branch", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const udpateBranch = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const branchId = parseInt(req.params.id); 
    if (isNaN(branchId)) {
      return res.status(400).json({ success: false, message: "Invalid branch ID" });
    }

    const dto = new ownerDto.BranchDTO(req.body);
    const data = ownerMap.MapUpdateBranch(dto);

    const result = await branchService.updateBranch(userId, branchId, data);
    res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: result,
    });
  } catch (error) {
    logger.error("[Controller] Update Branch", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteBranch = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const branchId = parseInt(req.params.id);
    if (isNaN(branchId)) {
      return res.status(400).json({ success: false, message: "Invalid branch ID" });
    }

    await branchService.deleteBranch(userId, branchId);
    res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
    });
  } catch (error) {
    logger.error("[Controller] Delete Branch", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
