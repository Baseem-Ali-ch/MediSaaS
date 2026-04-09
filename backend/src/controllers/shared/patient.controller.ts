import { Response } from "express";
import * as patientService from "../../services/shared/patient.service";
import logger from "../../config/logger";
import { CreatePatientDTO, UpdatePatientDTO } from "../../dtos/patient.dto";

export const getPatients = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const patients = await patientService.getPatients(userId);
    res.json({ success: true, data: patients });
  } catch (error: any) {
    logger.error("[Controller] Error fetching patients:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch patients" });
  }
};

export const getPatientById = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const patientId = Number(req.params.id);
    const patient = await patientService.getPatientById(userId, patientId);
    res.json({ success: true, data: patient });
  } catch (error: any) {
    logger.error("[Controller] Error fetching patient:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch patient" });
  }
};

export const createPatient = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const ipAddress = req.ip ?? (req.headers["x-forwarded-for"] as string) ?? null;

    const dto = new CreatePatientDTO(req.body);
    const patient = await patientService.createPatient(userId, dto, ipAddress);
    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error: any) {
    logger.error("[Controller] Error creating patient:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create patient" });
  }
};

export const updatePatient = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const ipAddress = req.ip ?? (req.headers["x-forwarded-for"] as string) ?? null;

    const patientId = Number(req.params.id);
    const dto = new UpdatePatientDTO(req.body);
    const patient = await patientService.updatePatient(userId, patientId, dto, ipAddress);
    res.json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error: any) {
    logger.error("[Controller] Error updating patient:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update patient" });
  }
};

export const deletePatient = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const ipAddress = req.ip ?? (req.headers["x-forwarded-for"] as string) ?? null;

    const patientId = Number(req.params.id);

    const patient = await patientService.deletePatient(userId, patientId, ipAddress);
    res.json({
      success: true,
      message: "Patient suspended successfully",
      data: patient,
    });
  } catch (error: any) {
    logger.error("[Controller] Error deleting patient:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to delete patient" });
  }
};
