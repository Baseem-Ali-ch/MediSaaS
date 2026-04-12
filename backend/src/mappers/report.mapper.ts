import { ReportResponseDTO } from "../dtos/report.dto";

export const toFrontendReport = (report: any) => {
  if (!report) return null;
  return new ReportResponseDTO(report);
};

export const toFrontendReports = (reports: any[]) => {
  return reports.map(toFrontendReport);
};
