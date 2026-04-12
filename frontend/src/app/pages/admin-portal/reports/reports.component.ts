import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { LoaderService } from '../../../services/loader.service';
import { HttpService } from '../../../services/http.service';
import { ToastService } from '../../../services/toast.service';
import { finalize } from 'rxjs';
import { ConfirmationPopupComponent } from '../../../components/popup/confirmation/confirmation.component';
import { ReportDetailsPopupComponent } from './report-details.popup';
import { ReportPreviewPopupComponent } from './report-preview.popup';
import { BookingDetailsPopupComponent } from '../bookings/booking-details.popup';

export interface ReportData {
  id: string;
  reportId: string;
  bookingId: string;
  patientId: string;
  bookingNo: string;
  patientName: string;
  patientDetails: any;
  tests: any[];
  reportedDate: string;
  status: 'DRAFT' | 'REPORTED';
  results: any[];
}

@Component({
  selector: 'app-reports',
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
    MatTabsModule,
    MatInputModule,
    MatNativeDateModule,
    PaginationComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrls: [
    './reports.component.css',
    '../../../../assets/styles/form.css',
    '../../../../assets/styles/table.css',
  ],
})
export class ReportsComponent implements OnInit {
  pendingBookings: any[] = [];
  generatedReports: ReportData[] = [];

  pendingColumns: string[] = ['bookingNo', 'patientName', 'tests', 'bookedDate', 'actions'];
  reportedColumns: string[] = [
    'reportId',
    'bookingNo',
    'patientName',
    'tests',
    'reportedDate',
    'actions',
  ];

  @ViewChild('pendingSort') pendingSort!: MatSort;
  @ViewChild('reportedSort') reportedSort!: MatSort;

  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPendingItems: number = 0;
  totalReportedItems: number = 0;

  isPanelOpen = false;
  isSubmitting1 = false;
  isSubmitting2 = false;
  isSubmitting3 = false;
  activeTab: number = 0;

  // Report Form Model
  reportModel: any = {
    id: '',
    bookingId: '',
    patientId: '',
    bookingNo: '',
    patientName: '',
    patientDetails: null,
    tests: [],
    results: [],
    labDetails: {
      name: 'Central Diagnostic Lab',
      address: '123 Health St, Medical District',
      contact: '+91 9876543210',
    },
  };

  constructor(
    private loaderService: LoaderService,
    private httpService: HttpService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.fetchReports();
    this.fetchPendingBookings();
  }

  fetchPendingBookings() {
    this.loaderService.show();
    this.httpService
      .get('/shared/bookings')
      .pipe(
        finalize(() => {
          this.loaderService.hide();
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          const allBookings = res.data || [];
          // Pending: Not reported yet (no reportId associated or status is not Reported)
          this.pendingBookings = allBookings.filter((b: any) => b.bookingStatus !== 'REPORTED');
          this.totalPendingItems = this.pendingBookings.length;
        },
        error: () => {
          this.toastService.show('Failed to fetch pending bookings');
        },
      });
  }

  fetchReports() {
    this.loaderService.show();
    this.httpService
      .get('/shared/reports')
      .pipe(
        finalize(() => {
          this.loaderService.hide();
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.generatedReports = res.data || [];
          this.totalReportedItems = this.generatedReports.length;
        },
        error: () => {
          this.toastService.show('Failed to fetch reports');
        },
      });
  }

  getFilteredPending() {
    let result = [...this.pendingBookings];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (b) => b.bookingNo.toLowerCase().includes(q) || b.patientName.toLowerCase().includes(q),
      );
    }
    const start = (this.currentPage - 1) * this.pageSize;
    return result.slice(start, start + this.pageSize);
  }

  getFilteredReported() {
    let result = [...this.generatedReports];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.bookingNo.toLowerCase().includes(q) ||
          r.patientName.toLowerCase().includes(q) ||
          r.reportId.toLowerCase().includes(q),
      );
    }
    const start = (this.currentPage - 1) * this.pageSize;
    return result.slice(start, start + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  openGenerateReport(booking: any) {
    this.reportModel = {
      tests: booking.tests || [],
      testResults: (booking.tests || []).map((t: any) => ({
        testId: t.id || t.testId,
        testName: t.testName,
        result: '',
        unit: t.unit || t.parameters?.split(',')[0].split(':')[1] || '',
        referenceRange: t.referenceRange || '',
        status: 'Pending',
      })),
    };
    this.isPanelOpen = true;
  }

  openEditReport(report: ReportData) {
    this.reportModel = {
      ...report,
    };
    this.isPanelOpen = true;
  }

  closePanel() {
    this.isPanelOpen = false;
  }

  saveReport(isDraft: boolean) {
    if (isDraft) {
      this.isSubmitting2 = true;
    } else {
      this.isSubmitting3 = true;
    }
    const status = isDraft ? 'DRAFT' : 'REPORTED';
    const payload = {
      bookingId: this.reportModel.bookingId,
      patientId: this.reportModel.patientId,
      status: status,
      testResults: this.reportModel.testResults.map((r: any) => ({
        testId: r.testId,
        result: r.result || '-',
      })),
    };

    const request = this.reportModel.id
      ? this.httpService.put(`/shared/reports/${this.reportModel.id}`, payload)
      : this.httpService.post('/shared/reports', payload);

    request
      .pipe(
        finalize(() => {
          this.isSubmitting3 = false;
          this.isSubmitting2 = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.toastService.show(
            `Report ${this.reportModel.id ? 'updated' : 'created'} successfully`,
          );
          this.closePanel();
          this.fetchReports();
          this.fetchPendingBookings();
        },
        error: (err: any) => {
          this.toastService.show(err.error?.message || 'Failed to save report');
        },
      });
  }

  openReportDetails(report: ReportData) {
    this.dialog.open(ReportDetailsPopupComponent, {
      width: '800px',
      panelClass: 'sharp-dialog',
      data: { report },
    });
  }

  deleteReport(report: ReportData) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      panelClass: 'sharp-dialog',
      data: {
        title: 'Delete Report',
        message: `Are you sure you want to delete report <b>${report.reportId}</b> for <b>${report.patientName}</b>?`,
        type: 'error',
        confirmText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loaderService.show();
        this.httpService
          .delete(`/shared/reports/${report.id}`)
          .pipe(finalize(() => this.loaderService.hide()))
          .subscribe({
            next: () => {
              this.toastService.show('Report deleted successfully');
              this.fetchReports();
              this.fetchPendingBookings();
            },
            error: () => this.toastService.show('Failed to delete report'),
          });
      }
    });
  }

  printReport(report: ReportData) {
    this.previewReport(report, true);
  }

  previewReport(report: ReportData, printImmediately = false) {
    this.dialog.open(ReportPreviewPopupComponent, {
      width: '100%',
      maxWidth: '1000px',
      data: {
        report,
        printOnOpen: printImmediately,
      },
      panelClass: 'sharp-dialog',
    });
  }

  openBookingDetails(booking: any) {
    this.dialog.open(BookingDetailsPopupComponent, {
      width: '600px',
      panelClass: 'sharp-dialog',
      data: { booking },
    });
  }
}
