import { PrismaClient, Prisma, Booking } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class BookingRepository extends BaseRepository<
  Booking,
  Prisma.BookingCreateInput,
  Prisma.BookingUpdateInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "booking");
  }

  getBookings = async (labId: number) => {
    return this.prisma.booking.findMany({
      where: { labId, bookingStatus: { not: "CANCELLED" } },
      include: {
        patient: true,
        tests: true,
      },
      orderBy: { createdAt: "desc" },
    });
  };

  getBookingById = async (id: number) => {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        patient: true,
        tests: true,
      },
    });
  };

}
