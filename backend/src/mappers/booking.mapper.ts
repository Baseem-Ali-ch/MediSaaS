export const toFrontendBooking = (booking: any) => {
  if (!booking) return null;
  return {
    id: booking.id,
    bookingNo: booking.bookingNo,
    testsCount: booking.testsCount,
    totalAmount: Number(booking.totalAmount),
    discountType: booking.discountType,
    discountValue: Number(booking.discountValue),
    finalAmount: Number(booking.finalAmount),
    paymentStatus: booking.paymentStatus,
    bookingStatus: booking.bookingStatus,
    bookedFor: booking.bookedFor.toISOString(),
    createdAt: booking.createdAt.toISOString(),
    patient: booking.patient,
    tests: booking.tests || [],
  };
};
