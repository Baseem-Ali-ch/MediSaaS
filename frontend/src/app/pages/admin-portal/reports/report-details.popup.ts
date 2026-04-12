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
              Booking No: {{ report.booking.bookingNo }} • Date:
              {{ report.createdAt | date: 'mediumDate' }}
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
                    <p>{{ report.patient.name }}</p>
                  </div>
                  <div class="detail-item">
                    <label>Age / Gender</label>
                    <p>{{ report.patient.age }} / {{ report.patient.gender }}</p>
                  </div>
                  <div class="detail-item">
                    <label>Patient ID</label>
                    <p>{{ report.patient.refId }}</p>
                  </div>
                </div>

                <div class="info-group">
                  <h3 class="section-subtitle">Booking Details</h3>
                  <div class="detail-item">
                    <label>Booking ID</label>
                    <p>{{ report.booking.bookingNo }}</p>
                  </div>
                  <div class="detail-item">
                    <label>Booked For</label>
                    <p>{{ report.booking.bookedFor | date: 'mediumDate' }}</p>
                  </div>
                  <div class="detail-item">
                    <label>Status</label>
                    <p>
                      <span
                        class="role-badge"
                        [ngClass]="report.booking.bookingStatus?.toLowerCase()"
                        >{{ report.booking.bookingStatus }}</span
                      >
                    </p>
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
                      @for (res of report.testResults; track res.testId) {
                        <tr>
                          <td>
                            <b>{{ res.test.testName }}</b>
                          </td>
                          <td class="font-600 color-primary">{{ res.result || 'N/A' }}</td>
                          <td>{{ res.test.unit || '-' }}</td>
                          <td>{{ res.test.referenceRange || '-' }}</td>
                          <td>
                            <span
                              class="status-badge"
                              [ngClass]="res.test.status?.toLowerCase() || 'completed-lite'"
                              >{{ res.test.status }}</span
                            >
                          </td>
                        </tr>
                      }
                      @if (!report.testResults || report.testResults.length === 0) {
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
                  <p>{{ report.lab?.name || 'MediSaaS Diagnostics' }}</p>
                </div>
                <div class="detail-item">
                  <label>Branch</label>
                  <p>{{ report.branch?.name || 'Main Branch' }}</p>
                </div>
                <div class="detail-item">
                  <label>Address</label>
                  <p>{{ report.branch?.address || 'As per clinic registration' }}</p>
                </div>
                <div class="detail-item">
                  <label>Contact</label>
                  <p>{{ report.branch?.phone || '-' }}</p>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- AI Suggestion Tab -->
          <mat-tab *ngIf="report.aiSuggestion">
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">psychology</mat-icon>
              AI Suggestion
            </ng-template>
            <div class="tab-body p-20">
              <div class="info-group">
                <div class="flex align-center gap-8 mb-16">
                  <mat-icon color="primary">info</mat-icon>
                  <h3 class="section-subtitle mb-0">AI Generated Insights</h3>
                </div>
                
                <div class="ai-suggestion-card">
                  <p class="suggestion-text">
                    {{ report.aiSuggestion }}
                  </p>
                </div>

                <div class="alert alert-ai-warning">
                  <mat-icon>warning</mat-icon>
                  <div class="alert-content">
                    <h4 class="alert-title">Medical Disclaimer</h4>
                    <p class="alert-message">
                      This suggestion is made by AI for informational purposes only. It does not replace professional medical judgment. 
                      Please be careful and always verify these findings with a qualified healthcare professional before making any medical decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styleUrls: ['../../../../assets/styles/popup.css'],
  styles: [`
    .ai-suggestion-card {
      background: #f8faff;
      border: 1px solid #e2e8f0;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 16px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .suggestion-text {
      font-size: 15px;
      line-height: 1.6;
      color: #334155;
      margin: 0;
      white-space: pre-line;
    }
    .alert-ai-warning {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      color: #92400e;
      padding: 16px;
      border-radius: 12px;
      display: flex;
      gap: 12px;
    }
    .alert-title {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 700;
    }
    .alert-message {
      margin: 0;
      font-size: 12px;
      line-height: 1.4;
    }
    .mb-0 { margin-bottom: 0; }
  `]
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
