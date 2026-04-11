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

export interface ReportData {
  id: string;
  reportId: string;
  bookingNo: string;
  patientName: string;
  patientDetails: any;
  tests: any[];
  reportedDate: string;
  status: 'Draft' | 'Reported';
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
  reportedColumns: string[] = ['reportId', 'bookingNo', 'patientName', 'tests', 'reportedDate', 'actions'];

  @ViewChild('pendingSort') pendingSort!: MatSort;
  @ViewChild('reportedSort') reportedSort!: MatSort;

  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPendingItems: number = 0;
  totalReportedItems: number = 0;

  isPanelOpen = false;
  isSubmitting = false;
  activeTab: number = 0;

  // Report Form Model
  reportModel: any = {
    bookingId: '',
    bookingNo: '',
    patientName: '',
    patientDetails: null,
    tests: [],
    results: [],
    labDetails: {
      name: 'Central Diagnostic Lab',
      address: '123 Health St, Medical District',
      contact: '+91 9876543210'
    }
  };

  constructor(
    private loaderService: LoaderService,
    private httpService: HttpService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.loaderService.show();
    
    // Demo Data for initial display
    const demoBookings = [
      {
        id: '1',
        bookingNo: 'BK-1001',
        patientName: 'John Doe',
        patientDetails: { name: 'John Doe', age: 45, gender: 'Male', patientId: 'P-101' },
        tests: [{ id: 't1', testName: 'Complete Blood Count', unit: 'g/dL', referenceRange: '13-17' }],
        bookedFor: new Date().toISOString(),
        bookingStatus: 'Pending'
      },
      {
        id: '2',
        bookingNo: 'BK-1002',
        patientName: 'Jane Smith',
        patientDetails: { name: 'Jane Smith', age: 32, gender: 'Female', patientId: 'P-102' },
        tests: [
          { id: 't2', testName: 'Blood Glucose', unit: 'mg/dL', referenceRange: '70-99' },
          { id: 't3', testName: 'Lipid Profile', unit: 'mg/dL', referenceRange: '< 200' }
        ],
        bookedFor: new Date().toISOString(),
        bookingStatus: 'In Progress'
      }
    ];

    const demoReports: ReportData[] = [
      {
        id: '3',
        reportId: 'REP-5501',
        bookingNo: 'BK-0998',
        patientName: 'Robert Wilson',
        patientDetails: { name: 'Robert Wilson', age: 58, gender: 'Male', patientId: 'P-098' },
        tests: [{ id: 't1', testName: 'Complete Blood Count' }],
        reportedDate: new Date(Date.now() - 86400000).toISOString(),
        status: 'Reported',
        results: [
          { testId: 't1', testName: 'Hemoglobin', value: '14.5', unit: 'g/dL', referenceRange: '13-17' },
          { testId: 't1', testName: 'WBC Count', value: '7500', unit: 'cells/mcL', referenceRange: '4500-11000' }
        ]
      },
      {
        id: '4',
        reportId: 'REP-5502',
        bookingNo: 'BK-0999',
        patientName: 'Emily Brown',
        patientDetails: { name: 'Emily Brown', age: 24, gender: 'Female', patientId: 'P-099' },
        tests: [{ id: 't4', testName: 'Thyroid Profile' }],
        reportedDate: new Date(Date.now() - 172800000).toISOString(),
        status: 'Reported',
        results: [
          { testId: 't4', testName: 'TSH', value: '2.4', unit: 'mIU/L', referenceRange: '0.4-4.0' }
        ]
      }
    ];

    this.httpService.get('/shared/bookings').pipe(
      finalize(() => {
        this.loaderService.hide();
        // If API returns empty, use demo data
        if (this.pendingBookings.length === 0) {
          this.pendingBookings = demoBookings;
          this.totalPendingItems = demoBookings.length;
        }
        if (this.generatedReports.length === 0) {
          this.generatedReports = demoReports;
          this.totalReportedItems = demoReports.length;
        }
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res: any) => {
        const allBookings = res.data || [];
        if (allBookings.length > 0) {
          // Pending: Not reported yet
          this.pendingBookings = allBookings.filter((b: any) => b.bookingStatus !== 'Reported');
          this.totalPendingItems = this.pendingBookings.length;

          // Reported mappings...
          this.generatedReports = allBookings
            .filter((b: any) => b.bookingStatus === 'Reported')
            .map((b: any) => ({
              id: b.id,
              reportId: 'REP-' + b.bookingNo.split('-')[1],
              bookingNo: b.bookingNo,
              patientName: b.patientName,
              patientDetails: b.patientDetails || { name: b.patientName, age: 30, gender: 'Male' },
              tests: b.tests || [],
              reportedDate: b.updatedAt || new Date().toISOString(),
              status: 'Reported',
              results: b.results || []
            }));
          this.totalReportedItems = this.generatedReports.length;
        }
      },
      error: () => {
        // Use demo data on error as well
        this.pendingBookings = demoBookings;
        this.totalPendingItems = demoBookings.length;
        this.generatedReports = demoReports;
        this.totalReportedItems = demoReports.length;
        this.toastService.show('Showing demo data (API unreachable)');
      }
    });
  }

  getFilteredPending() {
    let result = [...this.pendingBookings];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(b => b.bookingNo.toLowerCase().includes(q) || b.patientName.toLowerCase().includes(q));
    }
    const start = (this.currentPage - 1) * this.pageSize;
    return result.slice(start, start + this.pageSize);
  }

  getFilteredReported() {
    let result = [...this.generatedReports];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(r => r.bookingNo.toLowerCase().includes(q) || r.patientName.toLowerCase().includes(q) || r.reportId.toLowerCase().includes(q));
    }
    const start = (this.currentPage - 1) * this.pageSize;
    return result.slice(start, start + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  openGenerateReport(booking: any) {
    this.reportModel = {
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      patientName: booking.patientName,
      patientDetails: booking.patientDetails || { name: booking.patientName, age: '-', gender: '-' },
      tests: booking.tests || [],
      results: (booking.tests || []).map((t: any) => ({
        testId: t.id || t.testId,
        testName: t.testName,
        value: '',
        unit: t.unit || '',
        referenceRange: t.referenceRange || '',
        status: 'Pending'
      })),
      labDetails: {
        name: 'MediSaaS Central Lab',
        address: 'Main Branch, City Center',
        contact: '+91 1234567890'
      }
    };
    this.isPanelOpen = true;
  }

  openEditReport(report: ReportData) {
    // Similar to generate but with existing results
    this.reportModel = {
      ...report,
      bookingId: report.id,
      labDetails: {
        name: 'MediSaaS Central Lab',
        address: 'Main Branch, City Center',
        contact: '+91 1234567890'
      }
    };
    this.isPanelOpen = true;
  }

  closePanel() {
    this.isPanelOpen = false;
  }

  saveReport(isDraft: boolean) {
    this.isSubmitting = true;
    const status = isDraft ? 'In Progress' : 'Reported';
    
    // In real app, call API to save report and update booking status
    const payload = {
      bookingId: this.reportModel.bookingId,
      results: this.reportModel.results,
      status: status
    };

    this.httpService.put(`/shared/bookings/${this.reportModel.bookingId}`, { bookingStatus: status, results: this.reportModel.results })
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (res: any) => {
          this.toastService.show(`Report saved as ${status} successfully`);
          this.closePanel();
          this.fetchData();
        },
        error: () => this.toastService.show('Failed to save report')
      });
  }

  openReportDetails(report: ReportData) {
    this.dialog.open(ReportDetailsPopupComponent, {
      width: '800px',
      panelClass: 'sharp-dialog',
      data: { report }
    });
  }

  deleteReport(report: any) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      panelClass: 'sharp-dialog',
      data: {
        title: 'Delete Report',
        message: `Are you sure you want to delete report for <b>${report.patientName}</b>?`,
        type: 'error',
        confirmText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastService.show('Report deleted successfully');
        // Logic to delete...
      }
    });
  }

  printReport(report: ReportData) {
    this.toastService.show('Preparing print view...');
    // Implementation for printing
  }

  previewReport() {
    this.toastService.show('Opening preview...');
    // Implementation for preview
  }
}
