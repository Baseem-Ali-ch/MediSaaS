import { PrismaClient, User, Prisma, Branch } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class BranchRepository extends BaseRepository<
  Branch,
  Prisma.BranchCreateInput,
  Prisma.BranchUpdateInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "branch");
  }

  async findByEmail(email: string): Promise<Branch | null> {
    return this.prisma.branch.findFirst({ where: { email } });
  }
}
