import { PrismaClient, Prisma, ActivityLog } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class ActivityLogRepository extends BaseRepository<
  ActivityLog,
  Prisma.ActivityLogCreateInput,
  Prisma.ActivityLogUpdateInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "activityLog");
  }
}
