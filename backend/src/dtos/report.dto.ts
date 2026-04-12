export class CreateReportDTO {
  bookingId: number;
  patientId: number;
  status: string;
  testResults: {
    testId: number;
    result: string;
  }[];

  constructor(data: any) {
    this.bookingId = Number(data.bookingId);
    this.patientId = Number(data.patientId);
    this.status = data.status || "REPORTED";
    this.testResults = Array.isArray(data.testResults)
      ? data.testResults.map((t: any) => ({
          testId: Number(t.testId),
          result: t.result,
        }))
      : [];
  }
}

export class UpdateReportDTO {
  status?: string;
  aiSuggestion?: string;
  testResults?: {
    testId: number;
    result: string;
  }[];

  constructor(data: any) {
    this.status = data.status;
    this.aiSuggestion = data.aiSuggestion;
    this.testResults = data.testResults;
  }
}

export class ReportResponseDTO {
  id: number;
  reportId: string | null;
  bookingId: number | null;
  patientId: number | null;

  patient: any;
  booking: any;
  lab: any;
  branch: any;

  testResults: any;
  status: string | null;
  aiSuggestion: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.reportId = data.reportId;
    this.bookingId = data.bookingId;
    this.patientId = data.patientId;

    this.status = data.status;
    this.aiSuggestion = data.aiSuggestion;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;

    this.patient = data.patient || null;
    this.booking = data.booking || null;

    try {
      this.testResults =
        typeof data.testResults === "string"
          ? JSON.parse(data.testResults)
          : data.testResults;
    } catch {
      this.testResults = data.testResults;
    }
    this.lab = data.lab || null;
    this.branch = data.branch || null;
  }
}
