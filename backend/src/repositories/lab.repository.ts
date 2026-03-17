import { PrismaClient, User, Prisma, Lab } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class LabRepository extends BaseRepository<
  Lab,
  Prisma.LabCreateInput,
  Prisma.LabUpdateInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "lab");
  }

  async findByEmail(email: string): Promise<Lab | null> {
    return this.prisma.lab.findFirst({ where: { email } });
  }


}
