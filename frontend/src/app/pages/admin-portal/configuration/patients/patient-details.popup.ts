import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-patient-details-popup',
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
      <!-- Header -->
      <div class="popup-header p-20 flex-between">
        <div class="flex gap-16 align-center">
          <div class="avatar-container">
            <div class="avatar-placeholder">
              <mat-icon>person</mat-icon>
            </div>
          </div>
          <div class="header-info">
            <div class="flex align-center gap-8">
              <h2 class="patient-title">{{ patient.name }}</h2>
              <span class="id-badge">{{ patient.refId }}</span>
            </div>
            <p class="text-muted">{{ patient.gender }} • {{ patient.age }} Years</p>
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
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">info</mat-icon>
              General Information
            </ng-template>
            <div class="tab-body p-20">
              <div class="info-grid">
                <div class="info-group">
                  <h3 class="section-subtitle">Contact Information</h3>
                  <div class="detail-item">
                    <label>Phone Number</label>
                    <p>{{ patient.phone || '—' }}</p>
                  </div>
                  <div class="detail-item">
                    <label>Email Address</label>
                    <p>{{ patient.email || '—' }}</p>
                  </div>
                  <div class="detail-item">
                    <label>Address</label>
                    <p>{{ patient.address || '—' }}</p>
                  </div>
                </div>

                <div class="info-group">
                  <h3 class="section-subtitle">Medical Info</h3>
                  <div class="detail-item">
                    <label>Blood Group</label>
                    <p>
                      <span class="blood-badge">{{ patient.bloodGroup || '—' }}</span>
                    </p>
                  </div>
                  <div class="detail-item">
                    <label>Date of Birth</label>
                    <p>{{ (patient.dateOfBirth | date: 'mediumDate') || '—' }}</p>
                  </div>
                  <div class="detail-item">
                    <label>Emergency Contact</label>
                    <p>{{ patient.emergencyContact || '—' }}</p>
                  </div>
                </div>
              </div>

              <div class="info-group mt-20">
                <h3 class="section-subtitle">Additional Notes</h3>
                <div class="notes-box">
                  {{ patient.notes || 'No additional notes provided for this patient.' }}
                </div>
              </div>
            </div>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">history</mat-icon>
              Activity Log
            </ng-template>
            <div class="tab-body p-20">
              <div class="logs-list">
                <div class="log-row flex align-center gap-12 p-8" *ngFor="let log of activityLogs">
                  <div class="log-icon-wrap" [ngClass]="log.type">
                    <mat-icon>{{ log.icon }}</mat-icon>
                  </div>
                  <div class="log-content">
                    <div class="flex-between align-baseline">
                      <p class="log-msg">{{ log.action }}</p>
                      <span class="log-time">{{ log.date | date: 'shortTime' }}</span>
                    </div>
                    <p class="log-user">
                      by <span>{{ log.user }}</span>
                    </p>
                  </div>
                </div>

                <div
                  *ngIf="activityLogs.length === 0"
                  class="empty-logs text-center p-20 text-muted"
                >
                  No activity recorded.
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styleUrls: ['../../../../../assets/styles/popup.css'],
})
export class PatientDetailsPopupComponent {
  patient: any;
  activityLogs = [
    {
      date: new Date(),
      action: 'Patient Profile Updated',
      user: 'Admin User',
      icon: 'edit_note',
      type: 'update',
      details: 'Changed phone number and home address',
    },
    {
      date: new Date(Date.now() - 3600000 * 5),
      action: 'Lab Result Attached',
      user: 'Dr. Sarah Wilson',
      icon: 'biotech',
      type: 'lab',
      details: 'CBC and Liver Function Test results uploaded',
    },
    {
      date: new Date(Date.now() - 86400000 * 2),
      action: 'New Appointment Scheduled',
      user: 'Receptionist',
      icon: 'event',
      type: 'lab',
      details: 'Follow-up visit scheduled for April 15th',
    },
    {
      date: new Date(Date.now() - 86400000 * 10),
      action: 'Patient Registered',
      user: 'System',
      icon: 'person_add',
      type: 'create',
      details: 'Initial registration from online portal',
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<PatientDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.patient = data.patient;
  }

  close(): void {
    this.dialogRef.close();
  }

  edit(): void {
    this.dialogRef.close({ action: 'edit', patient: this.patient });
  }
}
