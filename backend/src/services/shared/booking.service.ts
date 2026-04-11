import { prisma } from "../../lib/prisma";
import { logActivity } from "../shared.service";
import { BookingRepository } from "../../repositories/booking.repository";
import { UserRepository } from "../../repositories/user.repository";
import { CreateBookingDTO, UpdateBookingDTO } from "../../dtos/booking.dto";
import * as bookingMapper from "../../mappers/booking.mapper";

const bookingRepo = new BookingRepository(prisma);
const userRepo = new UserRepository(prisma);

export const getBookings = async (userId: number) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const bookings = await bookingRepo.getBookings(user.labId!);
  return bookings.map(bookingMapper.toFrontendBooking);
};

export const getBookingById = async (userId: number, bookingId: number) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const booking = await bookingRepo.getBookingById(bookingId);
  if (!booking || booking.labId !== user.labId) {
    throw new Error("Booking not found");
  }

  return bookingMapper.toFrontendBooking(booking);
};

const mapStatusToDB = (status: string | undefined) => {
  if (!status) return undefined;
  const s = status.toUpperCase();
  if (s === "PARTIAL") return "PARTIALLY";
  if (s === "IN PROGRESS") return "PROCESSING";
  return s;
};

export const createBooking = async (
  userId: number,
  data: CreateBookingDTO,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const count = await prisma.booking.count({ where: { labId: user.labId } });
  const refId = `BK-${String(count + 1).padStart(3, "0")}`;

  const booking = await bookingRepo.create({
    bookingNo: refId,
    testsCount: data.testIds.length,
    totalAmount: data.totalAmount,
    discountType: data.discountType,
    discountValue: data.discountValue,
    finalAmount: data.finalAmount,
    paymentStatus: mapStatusToDB(data.paymentStatus) || "PENDING",
    bookingStatus: mapStatusToDB(data.bookingStatus) || "PENDING",
    bookedFor: data.bookedFor,
    patient: { connect: { id: data.patientId } },
    lab: { connect: { id: user.labId! } },
    ...(user.branchId && { branch: { connect: { id: user.branchId } } }),
    tests: { connect: data.testIds.map((id) => ({ id })) },
  } as any);

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "BOOKING_CREATED",
    entity: "Booking",
    message: `${user.email} created a new booking (ID: ${booking.id})`,
    metadata: {
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  return bookingMapper.toFrontendBooking(
    await bookingRepo.getBookingById(booking.id),
  );
};

export const updateBooking = async (
  userId: number,
  bookingId: number,
  data: UpdateBookingDTO,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const booking = await bookingRepo.getBookingById(bookingId);
  if (!booking || booking.labId !== user.labId) {
    throw new Error("Booking not found");
  }

  const updatedBooking = await bookingRepo.update(bookingId, {
    testsCount: data.testIds.length,
    totalAmount: data.totalAmount,
    discountType: data.discountType,
    discountValue: data.discountValue,
    finalAmount: data.finalAmount,
    paymentStatus: mapStatusToDB(data.paymentStatus),
    bookingStatus: mapStatusToDB(data.bookingStatus),
    bookedFor: data.bookedFor,
    patient: { connect: { id: data.patientId } },
    tests: {
      set: [],
      connect: data.testIds.map((id) => ({ id })),
    },
  } as any);

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "BOOKING_UPDATED",
    entity: "Booking",
    message: `${user.email} updated booking details for ID: ${bookingId}`,
    metadata: {
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  if (!updatedBooking) throw new Error("Failed to update booking");

  return bookingMapper.toFrontendBooking(
    await bookingRepo.getBookingById(bookingId),
  );
};

export const cancelBooking = async (
  userId: number,
  bookingId: number,
  ipAddress: string | null,
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const booking = await bookingRepo.findById(bookingId);
  if (!booking || booking.labId !== user.labId) {
    throw new Error("Booking not found");
  }

  const cancelledBooking = await bookingRepo.update(bookingId, {
    bookingStatus: "CANCELLED",
  });

  await logActivity({
    performedById: user.id!,
    labId: user.labId!,
    branchId: user.branchId,
    action: "BOOKING_CANCELLED",
    entity: "Booking",
    message: `${user.email} cancelled booking ID: ${bookingId}`,
    metadata: {
      ipAddress: ipAddress,
      timestamp: new Date().toISOString(),
    },
  });

  if (!cancelledBooking) throw new Error("Failed to cancel booking");

  return bookingMapper.toFrontendBooking(
    await bookingRepo.getBookingById(bookingId),
  );
};
