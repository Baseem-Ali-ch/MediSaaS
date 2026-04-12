import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { BookingDetailsPopupComponent } from './booking-details.popup';
import { LoaderService } from '../../../services/loader.service';
import { HttpService } from '../../../services/http.service';
import { ToastService } from '../../../services/toast.service';
import { finalize } from 'rxjs';
import { ConfirmationPopupComponent } from '../../../components/popup/confirmation/confirmation.component';

export interface BookingData {
  id: string;
  bookingNo: string;
  patientName: string;
  patientId: string;
  testsCount: number;
  totalAmount: number;
  discountType: 'Percentage' | 'Amount';
  discountValue: number;
  finalAmount: number;
  paymentStatus: 'Pending' | 'Partial' | 'Paid';
  bookingStatus: 'Pending' | 'In Progress' | 'Reported' | 'Cancelled';
  bookedFor: string;
  createdAt: string;
  tests: any[];
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    PaginationComponent,
  ],
  templateUrl: './bookings.component.html',
  styleUrls: [
    './bookings.component.css',
    '../../../../assets/styles/form.css',
    '../../../../assets/styles/table.css',
  ],
})
export class BookingsComponent implements OnInit {
  bookings: BookingData[] = [];
  displayedColumns: string[] = [
    'bookingNo',
    'patientName',
    'testsCount',
    'totalAmount',
    'discount',
    'paymentStatus',
    'bookingStatus',
    'bookedFor',
    'actions',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';
  filterPaymentStatus: string = 'All';
  filterBookingStatus: string = 'All';
  currentPage: number = 1;
  pageSize: number = 10;
  totalFilteredItems: number = 0;
  filteredBookings: BookingData[] = [];

  isPanelOpen = false;
  editMode = false;
  isSubmitting = false;
  isPickerOpen = false;

  // Form Model
  bookingModel = this.getEmptyModel();
  originalModel = this.getEmptyModel();

  // Data for dropdowns
  patients: any[] = [];
  tests: any[] = [];

  // Search states
  patientSearch: string = '';
  testSearch: string = '';

  constructor(
    private loaderService: LoaderService,
    private httpService: HttpService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getBookings();
    this.loadPatients();
    this.loadTests();
  }

  getEmptyModel() {
    return {
      id: '',
      patientId: '',
      selectedTests: [] as any[],
      subtotal: 0,
      discountType: 'Percentage' as 'Percentage' | 'Amount',
      discountValue: 0,
      totalAmount: 0,
      paymentStatus: 'Pending' as 'Pending' | 'Partial' | 'Paid',
      bookingStatus: 'Pending' as 'Pending' | 'In Progress' | 'Reported' | 'Cancelled',
      bookedFor: new Date().toISOString().split('T')[0],
    };
  }

  getBookings() {
    this.loaderService.show();
    this.httpService
      .get('/shared/bookings')
      .pipe(
        finalize(() => {
          this.loaderService.hide();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.bookings = res.data || [];
          this.applyFilters();
        },
        error: () => {
          this.toastService.show('Failed to fetch bookings list');
        },
      });
  }

  loadPatients() {
    this.httpService.get('/shared/patients').subscribe({
      next: (res: any) => {
        this.patients = res.data || [];
      },
      error: () => {
        this.toastService.show('Failed to fetch patients list');
      },
    });
  }

  loadTests() {
    this.httpService.get('/shared/tests').subscribe({
      next: (res: any) => {
        this.tests = res.data || [];
      },
      error: () => {
        this.toastService.show('Failed to fetch tests list');
      },
    });
  }

  applyFilters(resetPage: boolean = false) {
    if (resetPage) {
      this.currentPage = 1;
    }
    let result = [...this.bookings];

    if (this.filterPaymentStatus !== 'All') {
      result = result.filter((b) => b.paymentStatus === this.filterPaymentStatus);
    }

    if (this.filterBookingStatus !== 'All') {
      result = result.filter((b) => b.bookingStatus === this.filterBookingStatus);
    }

    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (b) => b.bookingNo.toLowerCase().includes(q) || b.patientName.toLowerCase().includes(q),
      );
    }

    this.totalFilteredItems = result.length;

    const start = (this.currentPage - 1) * this.pageSize;
    this.filteredBookings = result.slice(start, start + this.pageSize);
  }

  getFilteredBookings(): BookingData[] {
    return this.filteredBookings;
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterPaymentStatus = 'All';
    this.filterBookingStatus = 'All';
    this.currentPage = 1;
    this.applyFilters();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.applyFilters(false);
  }

  openAddPanel() {
    this.editMode = false;
    this.bookingModel = this.getEmptyModel();
    this.originalModel = { ...this.bookingModel };
    this.isPanelOpen = true;
  }

  openBookingDetails(booking: BookingData) {
    this.dialog.open(BookingDetailsPopupComponent, {
      width: '600px',
      panelClass: 'sharp-dialog',
      data: { booking },
    });
  }

  openEditPanel(booking: BookingData) {
    this.editMode = true;
    this.bookingModel = {
      ...this.getEmptyModel(),
      id: booking.id,
      patientId: booking.patientId,
      selectedTests: [...booking.tests],
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      discountType: booking.discountType,
      discountValue: booking.discountValue,
      bookedFor: booking.bookedFor,
    };
    this.originalModel = JSON.parse(JSON.stringify(this.bookingModel));
    this.calculateTotal();
    this.isPanelOpen = true;
  }

  closePanel() {
    this.isPanelOpen = false;
  }

  onTestSelected() {
    this.calculateTotal();
  }

  calculateTotal() {
    this.bookingModel.subtotal = this.bookingModel.selectedTests.reduce(
      (sum, test) => sum + (test.price || 0),
      0,
    );

    if (this.bookingModel.discountType === 'Percentage') {
      const discountAmount =
        (this.bookingModel.subtotal * (this.bookingModel.discountValue || 0)) / 100;
      this.bookingModel.totalAmount = this.bookingModel.subtotal - discountAmount;
    } else {
      this.bookingModel.totalAmount =
        this.bookingModel.subtotal - (this.bookingModel.discountValue || 0);
    }

    if (this.bookingModel.totalAmount < 0) this.bookingModel.totalAmount = 0;
  }

  formValid(): boolean {
    return !!(
      !this.isSubmitting &&
      this.bookingModel.patientId &&
      this.bookingModel.selectedTests.length > 0 &&
      this.bookingModel.bookedFor
    );
  }

  hasChanges(): boolean {
    return JSON.stringify(this.bookingModel) !== JSON.stringify(this.originalModel);
  }

  saveBooking() {
    if (!this.formValid()) {
      if (!this.bookingModel.patientId || this.bookingModel.selectedTests.length === 0) {
        this.toastService.show('Please select patient and at least one test');
      }
      return;
    }

    this.isSubmitting = true;

    const bookingDTO = {
      patientId: this.bookingModel.patientId,
      testIds: this.bookingModel.selectedTests.map((t: any) => t.id || t.testId),
      discountType: this.bookingModel.discountType,
      discountValue: this.bookingModel.discountValue,
      bookedFor: this.bookingModel.bookedFor,
      paymentStatus: this.bookingModel.paymentStatus,
      bookingStatus: this.bookingModel.bookingStatus,
      totalAmount: this.bookingModel.totalAmount,
      subtotal: this.bookingModel.subtotal,
    };

    if (this.editMode) {
      this.httpService
        .put(`/shared/bookings/${this.bookingModel.id}`, bookingDTO)
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
          }),
        )
        .subscribe({
          next: (res: any) => {
            if (res.success) {
              const idx = this.bookings.findIndex((b) => b.id === this.bookingModel.id);
              if (idx !== -1) {
                const patient = this.patients.find((p) => p.id === this.bookingModel.patientId);
                const updatedBooking: BookingData = {
                  ...this.bookings[idx],
                  patientName: patient?.name || this.bookings[idx].patientName,
                  patientId: this.bookingModel.patientId,
                  testsCount: this.bookingModel.selectedTests.length,
                  totalAmount: this.bookingModel.totalAmount,

                  discountType: this.bookingModel.discountType,
                  discountValue: this.bookingModel.discountValue,
                  paymentStatus: this.bookingModel.paymentStatus,
                  bookingStatus: this.bookingModel.bookingStatus as
                    | 'Pending'
                    | 'In Progress'
                    | 'Reported'
                    | 'Cancelled',
                  bookedFor: this.bookingModel.bookedFor,
                  tests: [...this.bookingModel.selectedTests],
                };
                this.bookings[idx] = updatedBooking;
                this.bookings = [...this.bookings];
                this.applyFilters();
                this.toastService.show('Booking updated successfully');
              }
              this.closePanel();
            } else {
              this.toastService.show(res.message || 'Failed to update booking');
            }
          },
          error: () => {
            this.toastService.show('Failed to update booking');
          },
        });
    } else {
      this.httpService
        .post('/shared/bookings', bookingDTO)
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
          }),
        )
        .subscribe({
          next: (res: any) => {
            if (res.success) {
              const patient = this.patients.find((p) => p.id === this.bookingModel.patientId);
              const newBooking: BookingData = {
                id: res.data?.id || res.id,
                bookingNo: res.data?.bookingNo || res.bookingNo || 'BK-NEW',
                patientName: patient?.name || 'Unknown',
                patientId: this.bookingModel.patientId,
                testsCount: this.bookingModel.selectedTests.length,
                totalAmount: this.bookingModel.subtotal,
                discountType: this.bookingModel.discountType,
                discountValue: this.bookingModel.discountValue,
                finalAmount: this.bookingModel.totalAmount,
                paymentStatus: this.bookingModel.paymentStatus,
                bookingStatus: (this.bookingModel.bookingStatus as any) || 'Booked',
                bookedFor: this.bookingModel.bookedFor,
                createdAt: new Date().toISOString(),
                tests: [...this.bookingModel.selectedTests],
              };
              this.bookings = [...this.bookings, newBooking];
              this.applyFilters();
              this.toastService.show('Booking created successfully');
              this.closePanel();
            } else {
              this.toastService.show(res.message || 'Failed to create booking');
            }
          },
          error: () => {
            this.toastService.show('Failed to create booking');
          },
        });
    }
  }

  cancelBooking(booking: BookingData) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      panelClass: 'sharp-dialog',
      data: {
        title: 'Cancel Booking',
        message: `Are you sure you want to cancel booking <b>${booking.bookingNo}</b>?`,
        type: 'error',
        confirmText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loaderService.show();
        this.httpService
          .delete(`/shared/bookings/${booking.id}`)
          .pipe(
            finalize(() => {
              this.loaderService.hide();
            }),
          )
          .subscribe({
            next: (res: any) => {
              if (res.success) {
                this.bookings = this.bookings.filter((b) => b.id !== booking.id);
                this.applyFilters();
                this.toastService.show('Booking cancelled successfully');
              } else {
                this.toastService.show(res.message || 'Failed to cancel booking');
              }
            },
            error: (err) => {
              this.toastService.show('Failed to cancel booking');
            },
          });
      }
    });
  }

  getFilteredPatients() {
    if (!this.patientSearch) return this.patients;
    const q = this.patientSearch.toLowerCase();
    return this.patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.patientId.toLowerCase().includes(q),
    );
  }

  getFilteredTests() {
    if (!this.testSearch) return this.tests;
    const q = this.testSearch.toLowerCase();
    return this.tests.filter(
      (t) => t.testName.toLowerCase().includes(q) || t.testCode.toLowerCase().includes(q),
    );
  }
}
