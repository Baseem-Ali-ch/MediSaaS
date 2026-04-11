import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-report-details-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTabsModule,
  ],
  template: `
    <div class="popup-container modern-card">
      <div class="popup-header p-20 flex-between">
        <div class="flex gap-16 align-center">
          <div class="avatar-container">
            <div class="avatar-placeholder">
              <mat-icon>assignment_turned_in</mat-icon>
            </div>
          </div>
          <div class="header-info">
            <div class="flex align-center gap-8">
              <h2 class="test-title">Report: {{ report.reportId }}</h2>
              <span class="status-badge completed">Reported</span>
            </div>
            <p class="text-muted">
              Booking No: {{ report.bookingNo }} • Date:
              {{ report.reportedDate | date: 'mediumDate' }}
            </p>
          </div>
        </div>
        <div class="flex gap-8">
          <button mat-icon-button (click)="close()" class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <div class="popup-content">
        <mat-tab-group class="modern-tabs">
          <!-- Summary Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">description</mat-icon>
              Summary
            </ng-template>
            <div class="tab-body p-20">
              <div class="info-grid">
                <div class="info-group">
                  <h3 class="section-subtitle">Patient Details</h3>
                  <div class="detail-item">
                    <label>Full Name</label>
                    <p>{{ report.patientName }}</p>
                  </div>
                  <div class="detail-item">
                    <label>Age / Gender</label>
                    <p>{{ report.patientDetails.age }}y / {{ report.patientDetails.gender }}</p>
                  </div>
                  <div class="detail-item">
                    <label>Patient ID</label>
                    <p>{{ report.patientDetails.patientId || 'P-8821' }}</p>
                  </div>
                </div>

                <div class="info-group">
                  <h3 class="section-subtitle">Booking Details</h3>
                  <div class="detail-item">
                    <label>Booking ID</label>
                    <p>{{ report.bookingNo }}</p>
                  </div>
                  <div class="detail-item">
                    <label>Booked For</label>
                    <p>{{ report.reportedDate | date: 'mediumDate' }}</p>
                  </div>
                  <div class="detail-item">
                    <label>Status</label>
                    <p><span class="role-badge">Reported</span></p>
                  </div>
                </div>
              </div>

              <div class="info-group mt-24">
                <h3 class="section-subtitle">Test Results</h3>
                <div class="parameter-list-view">
                  <table class="simple-info-table">
                    <thead>
                      <tr>
                        <th>Test Parameter</th>
                        <th>Result</th>
                        <th>Unit</th>
                        <th>Ref. Range</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (res of report.results; track res.testId) {
                        <tr>
                          <td>
                            <b>{{ res.testName }}</b>
                          </td>
                          <td class="font-600 color-primary">{{ res.value || 'N/A' }}</td>
                          <td>{{ res.unit || '-' }}</td>
                          <td>{{ res.referenceRange || '-' }}</td>
                          <td><span class="status-badge completed-lite">Normal</span></td>
                        </tr>
                      }
                      @if (!report.results || report.results.length === 0) {
                        <tr>
                          <td colspan="5" class="text-center p-16 text-muted">
                            No results recorded
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Lab Info Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">business</mat-icon>
              Lab Details
            </ng-template>
            <div class="tab-body p-20">
              <div class="info-group">
                <h3 class="section-subtitle">Laboratory Information</h3>
                <div class="detail-item">
                  <label>Laboratory Name</label>
                  <p>MediSaaS Central Diagnostics</p>
                </div>
                <div class="detail-item">
                  <label>Branch</label>
                  <p>City Center Main Branch</p>
                </div>
                <div class="detail-item">
                  <label>Address</label>
                  <p>123 Healthway, Medical Hub, City - 400012</p>
                </div>
                <div class="detail-item">
                  <label>Contact</label>
                  <p>+91 9988776655</p>
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>

      <div class="popup-footer p-20 border-top flex justify-end gap-12">
        <button class="btn btn-outline-secondary" (click)="close()">Close</button>
        <button class="btn btn-primary"><mat-icon>print</mat-icon> Print Report</button>
      </div>
    </div>
  `,
  styleUrls: ['../../../../assets/styles/popup.css'],
})
export class ReportDetailsPopupComponent {
  report: any;

  constructor(
    public dialogRef: MatDialogRef<ReportDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.report = data.report;
  }

  close(): void {
    this.dialogRef.close();
  }
}
