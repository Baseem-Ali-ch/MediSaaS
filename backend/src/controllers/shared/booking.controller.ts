import { Response } from "express";
import * as bookingService from "../../services/shared/booking.service";
import logger from "../../config/logger";
import { CreateBookingDTO, UpdateBookingDTO } from "../../dtos/booking.dto";

const getIpAddress = (req: any): string | null => {
  return req.ip ?? (req.headers["x-forwarded-for"] as string) ?? null;
};

export const getBookings = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await bookingService.getBookings(userId);
    res.json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error: any) {
    logger.error("[BookingController] Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings",
    });
  }
};

export const getBookingById = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookingId = Number(req.params.id);
    const booking = await bookingService.getBookingById(userId, bookingId);



    res.json({
      success: true,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (error: any) {
    logger.error("[BookingController] Error fetching booking:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch booking",
    });
  }
};

export const createBooking = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const ipAddress = getIpAddress(req);
    const dto = new CreateBookingDTO(req.body);

    const booking = await bookingService.createBooking(userId, dto, ipAddress);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error: any) {
    logger.error("[BookingController] Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};

export const updateBooking = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const ipAddress = getIpAddress(req);
    const bookingId = Number(req.params.id);

    const dto = new UpdateBookingDTO(req.body);


    const booking = await bookingService.updateBooking(
      userId,
      bookingId,
      dto,
      ipAddress,
    );

    res.json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error: any) {
    logger.error("[BookingController] Error updating booking:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update booking",
    });
  }
};

export const cancelBooking = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const ipAddress = getIpAddress(req);
    const bookingId = Number(req.params.id);



    const result = await bookingService.cancelBooking(
      userId,
      bookingId,
      ipAddress,
    );

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: result,
    });
  } catch (error: any) {
    logger.error("[BookingController] Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel booking",
    });
  }
};
