export class CreateBookingDTO {
  patientId: number;
  testIds: number[];
  bookedFor: Date;
  totalAmount: number;
  discountType: "Percentage" | "Amount";
  discountValue: number;
  finalAmount: number;
  paymentStatus?: "Pending" | "Partial" | "Paid";
  bookingStatus?: "Pending" | "In Progress" | "Reported" | "Cancelled";

  constructor(data: any) {
    this.patientId = Number(data.patientId);
    this.testIds = Array.isArray(data.tests)
      ? data.tests.map((t: any) => Number(t.id))
      : Array.isArray(data.testIds)
      ? data.testIds.map(Number)
      : [];
    this.bookedFor = data.bookedFor ? new Date(data.bookedFor) : new Date();
    this.totalAmount = Number(data.totalAmount) || 0;
    this.discountType = data.discountType;
    this.discountValue = Number(data.discountValue) || 0;
    this.finalAmount = Number(data.finalAmount) || 0;
    this.paymentStatus = data.paymentStatus || "Pending";
    this.bookingStatus = data.bookingStatus || "Pending";
  }
}

export class UpdateBookingDTO extends CreateBookingDTO {
  constructor(data: any) {
    super(data);
  }
}

