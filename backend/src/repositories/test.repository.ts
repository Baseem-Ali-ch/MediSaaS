import { PrismaClient, Prisma, Test } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class TestRepository extends BaseRepository<
  Test,
  Prisma.TestCreateInput,
  Prisma.TestUpdateInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "test");
  }

  getTests = async (labId: number) => {
    return this.prisma.test.findMany({
      where: { labId, status: { not: "SUSPENDED" } },
    });
  };

  getTestsByIds = async (ids: number[]) => {
    return this.prisma.test.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  };
}
