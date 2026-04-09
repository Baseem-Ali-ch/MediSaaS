import { PrismaClient, Prisma, Patient } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class PatientRepository extends BaseRepository<
  Patient,
  Prisma.PatientCreateInput,
  Prisma.PatientUpdateInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "patient");
  }

  async findByPhone(phone: string): Promise<Patient | null> {
    return this.prisma.patient.findFirst({ where: { phone } });
  }

  getPatients = async (labId: number) => {
    return this.prisma.patient.findMany({ where: { labId, status: { not: "SUSPENDED" } } });
  };
}
