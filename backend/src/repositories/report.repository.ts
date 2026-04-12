import { PrismaClient, Prisma, Report } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class ReportRepository extends BaseRepository<
  Report,
  Prisma.ReportCreateInput,
  Prisma.ReportUpdateInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "report");
  }

  getReportsByLab = async (labId: number) => {
    return this.prisma.report.findMany({
      where: { labId, status: { not: "SUSPENDED" } },
      include: {
        patient: true,
        booking: true,
        branch: true,
        lab: true,
      },
      orderBy: { createdAt: "desc" },
    });
  };

  getReportById = async (id: number) => {
    return this.prisma.report.findUnique({
      where: { id },
      include: {
        patient: true,
        booking: true,
      },
    });
  };

  getReportsByBooking = async (bookingId: number) => {
    return this.prisma.report.findMany({
      where: { bookingId },
      include: {
        patient: true,
        booking: true,
      },
      orderBy: { createdAt: "asc" },
    });
  };
}
