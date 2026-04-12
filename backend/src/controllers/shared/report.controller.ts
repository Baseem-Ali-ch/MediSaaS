import { Response } from "express";
import * as reportService from "../../services/shared/report.service";
import logger from "../../config/logger";
import { CreateReportDTO, UpdateReportDTO } from "../../dtos/report.dto";

const getIpAddress = (req: any): string | null => {
  return req.ip ?? (req.headers["x-forwarded-for"] as string) ?? null;
};

export const getReports = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const reports = await reportService.getReports(userId);
    res.json({
      success: true,
      message: "Reports fetched successfully",
      data: reports,
    });
  } catch (error: any) {
    logger.error("[ReportController] Error fetching reports:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reports",
    });
  }
};

export const getReportById = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const reportId = Number(req.params.id);
    const report = await reportService.getReportById(userId, reportId);

    res.json({
      success: true,
      message: "Report fetched successfully",
      data: report,
    });
  } catch (error: any) {
    logger.error("[ReportController] Error fetching report:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch report",
    });
  }
};

export const createReport = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const ipAddress = getIpAddress(req);
    const dto = new CreateReportDTO(req.body);
    const reports = await reportService.createReport(userId, dto, ipAddress);

    res.status(201).json({
      success: true,
      message: "Report(s) created successfully",
      data: reports,
    });
  } catch (error: any) {
    logger.error("[ReportController] Error creating report:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create report",
    });
  }
};

export const updateReport = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const reportId = Number(req.params.id);
    const ipAddress = getIpAddress(req);
    const dto = new UpdateReportDTO(req.body);

    const report = await reportService.updateReport(
      userId,
      reportId,
      dto,
      ipAddress,
    );

    res.json({
      success: true,
      message: "Report updated successfully",
      data: report,
    });
  } catch (error: any) {
    logger.error("[ReportController] Error updating report:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update report",
    });
  }
};

export const deleteReport = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const reportId = Number(req.params.id);
    const ipAddress = getIpAddress(req);

    const result = await reportService.deleteReport(
      userId,
      reportId,
      ipAddress,
    );

    res.json({
      success: true,
      message: "Report deleted successfully",
      data: result,
    });
  } catch (error: any) {
    logger.error("[ReportController] Error deleting report:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete report",
    });
  }
};
