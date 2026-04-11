import { Response } from "express";
import * as testService from "../../services/shared/test.service";
import logger from "../../config/logger";
import { CreateTestDTO, UpdateTestDTO } from "../../dtos/test.dto";

export const getTests = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const tests = await testService.getTests(userId);
    res.json({
      success: true,
      message: "Tests fetched successfully",
      data: tests,
    });
  } catch (error: any) {
    logger.error("[Controller] Error fetching tests:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tests",
    });
  }
};

export const getTestById = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const testId = Number(req.params.id);
    const test = await testService.getTestById(userId, testId);
    res.json({
      success: true,
      message: "Test fetched successfully",
      data: test,
    });
  } catch (error: any) {
    logger.error("[Controller] Error fetching test:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch test",
    });
  }
};

export const createTest = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const ipAddress =
      req.ip ?? (req.headers["x-forwarded-for"] as string) ?? null;

    const dto = new CreateTestDTO(req.body);
    const test = await testService.createTest(userId, dto, ipAddress);
    res.status(201).json({
      success: true,
      message: "Test created successfully",
      data: test,
    });
  } catch (error: any) {
    logger.error("[Controller] Error creating test:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create test",
    });
  }
};

export const updateTest = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const ipAddress =
      req.ip ?? (req.headers["x-forwarded-for"] as string) ?? null;

    const testId = Number(req.params.id);
    const dto = new UpdateTestDTO(req.body);
    const test = await testService.updateTest(userId, testId, dto, ipAddress);
    res.json({
      success: true,
      message: "Test updated successfully",
      data: test,
    });
  } catch (error: any) {
    logger.error("[Controller] Error updating test:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update test",
    });
  }
};

export const deleteTest = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const ipAddress =
      req.ip ?? (req.headers["x-forwarded-for"] as string) ?? null;
    const testId = Number(req.params.id);

    const test = await testService.deleteTest(userId, testId, ipAddress);
    res.json({
      success: true,
      message: "Test deleted successfully",
      data: test,
    });
  } catch (error: any) {
    logger.error("[Controller] Error deleting test:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete test",
    });
  }
};
