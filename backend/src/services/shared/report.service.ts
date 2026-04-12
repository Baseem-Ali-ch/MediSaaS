import { prisma } from "../../lib/prisma";
import { AIHolisticSuggestion, logActivity } from "../shared.service";
import { ReportRepository } from "../../repositories/report.repository";
import { UserRepository } from "../../repositories/user.repository";
import { CreateReportDTO, UpdateReportDTO } from "../../dtos/report.dto";
import * as reportMapper from "../../mappers/report.mapper";
import { TestRepository } from "../../repositories/test.repository";

const reportRepo = new ReportRepository(prisma);
const userRepo = new UserRepository(prisma);
const testRepo = new TestRepository(prisma);

export const getReports = async (userId: number) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const reports = await reportRepo.getReportsByLab(user.labId!);

  const enrichedReports = await Promise.all(
    reports.map(async (report: any) => {
      const parsedResults =
        typeof report.testResults === "string"
          ? JSON.parse(report.testResults)
          : report.testResults || [];

      const testIds = parsedResults.map((t: any) => t.testId);

      const tests = await testRepo.getTestsByIds(testIds);

      const mergedResults = parsedResults.map((tr: any) => ({
        ...tr,
        test: tests.find((t: any) => t.id === tr.testId) || null,
      }));

      return {
        ...report,
        testResults: mergedResults,
      };
    }),
  );

  return reportMapper.toFrontendReports(enrichedReports);
};

export const getReportById = async (userId: number, reportId: number) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const report = await reportRepo.getReportById(reportId);
  if (!report || report.labId !== user.labId) {
    throw new Error("Report not found");
  }

  return reportMapper.toFrontendReport(report);
};

export const createReport = async (
  userId: number,
  data: CreateReportDTO,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
  });
  if (!booking) throw new Error("Booking not found");

  const count = await prisma.report.count({ where: { labId: user.labId } });
  const refId = `RP-${String(count + 1).padStart(3, "0")}`;

  const report = await reportRepo.create({
    reportId: refId,
    testResults: JSON.stringify(data.testResults),
    status: data.status,
    lab: { connect: { id: booking.labId } },
    branch: { connect: { id: booking.branchId } },
    booking: { connect: { id: booking.id } },
    patient: { connect: { id: booking.patientId } },
  });

  await prisma.booking.update({
    where: { id: data.bookingId },
    data: { bookingStatus: "REPORTED" },
  });

  const parsedResults =
    typeof report.testResults === "string"
      ? JSON.parse(report.testResults)
      : report.testResults;

  // Enrich results with test metadata
  const testIds = parsedResults.map((t: any) => t.testId);
  const tests = await testRepo.getTestsByIds(testIds);

  const enrichedResults = parsedResults.map((tr: any) => ({
    ...tr,
    test: tests.find((t: any) => t.id === tr.testId),
  }));

  const aiSuggestion = await AIHolisticSuggestion(
    enrichedResults,
    booking.patientId.toString(),
  );

  await reportRepo.update(report.id, {
    aiSuggestion,
  });

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "REPORT_GENERATED",
    entity: "Report",
    message: `${user.email} generated report for booking ID: ${data.bookingId} with Report ID: ${refId}`,
    metadata: {
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  const finalReport = await reportRepo.getReportById(report.id);
  return [reportMapper.toFrontendReport(finalReport!)];
};

export const updateReport = async (
  userId: number,
  reportId: number,
  data: UpdateReportDTO,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const report = await reportRepo.findById(reportId);
  if (!report || report.labId !== user.labId) {
    throw new Error("Report not found");
  }

  const updatedReport = await reportRepo.update(reportId, {
    testResults: data.testResults
      ? JSON.stringify(data.testResults)
      : undefined,
    status: data.status,
    aiSuggestion: data.aiSuggestion,
  });

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "REPORT_UPDATED",
    entity: "Report",
    message: `${user.email} updated report ID: ${reportId}`,
    metadata: {
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return reportMapper.toFrontendReport(
    await reportRepo.getReportById(reportId),
  );
};

export const deleteReport = async (
  userId: number,
  reportId: number,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const report = await reportRepo.findById(reportId);
  if (!report || report.labId !== user.labId) {
    throw new Error("Report not found");
  }

  // Soft delete: change status to SUSPENDED
  await reportRepo.update(reportId, {
    status: "SUSPENDED",
  });

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "REPORT_DELETED",
    entity: "Report",
    message: `${user.email} deleted (suspended) report ID: ${reportId}`,
    metadata: {
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return { success: true, message: "Report deleted successfully" };
};
