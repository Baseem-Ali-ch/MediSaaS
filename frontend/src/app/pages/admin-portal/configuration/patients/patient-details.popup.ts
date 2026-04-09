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
  styles: [
    `
      .popup-container {
        background: var(--bg-card);
        border-radius: var(--radius-card);
        overflow: hidden;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-lg);
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      .popup-header {
        background: var(--bg-main);
        border-bottom: 1px solid var(--border);
      }

      .avatar-container {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: var(--bg-card);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-sm);
      }

      .avatar-placeholder mat-icon {
        color: var(--primary);
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .patient-title {
        margin: 0;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-primary);
      }

      .id-badge {
        background: rgba(34, 197, 94, 0.1);
        color: var(--primary);
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.05em;
      }

      .blood-badge {
        background: rgba(220, 38, 38, 0.1);
        color: var(--danger);
        padding: 2px 10px;
        border-radius: 6px;
        font-weight: 700;
        border: 1px solid rgba(220, 38, 38, 0.2);
      }

      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
      }

      .section-subtitle {
        font-size: 0.8rem;
        text-transform: uppercase;
        color: var(--text-secondary);
        letter-spacing: 0.05em;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border);
      }

      .detail-item {
        margin-bottom: 16px;
      }

      .detail-item label {
        display: block;
        font-size: 0.72rem;
        color: var(--text-secondary);
        margin-bottom: 4px;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.02em;
      }

      .detail-item p {
        margin: 0;
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.9rem;
      }

      .notes-box {
        background: var(--bg-main);
        padding: 16px;
        border-radius: 8px;
        border: 1px solid var(--border);
        font-size: 0.85rem;
        color: var(--text-secondary);
        line-height: 1.6;
        font-style: italic;
      }

      /* Activity Log Style - Staff Dashboard Pattern */
      .log-row {
        border-radius: 6px;
        background: transparent;
        transition: var(--transition-fast);
        margin-bottom: 2px;
      }
      .log-row:hover {
        background: var(--bg-main);
      }

      .log-icon-wrap {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .log-icon-wrap mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .log-icon-wrap.update {
        background: rgba(202, 138, 4, 0.1);
        color: var(--warning);
      }
      .log-icon-wrap.lab {
        background: rgba(2, 132, 199, 0.1);
        color: var(--info);
      }
      .log-icon-wrap.create {
        background: rgba(34, 197, 94, 0.1);
        color: var(--success);
      }

      .log-content {
        flex: 1;
      }
      .log-msg {
        margin: 0;
        font-size: 0.82rem;
        color: var(--text-primary);
        font-weight: 600;
      }
      .log-time {
        font-size: 0.7rem;
        color: var(--text-secondary);
        font-weight: 600;
      }
      .log-user {
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin: 2px 0 0;
      }
      .log-user span {
        color: var(--primary);
        font-weight: 600;
      }

      .empty-logs {
        opacity: 0.6;
        font-size: 0.85rem;
      }

      /* Tabs Styling */
      ::ng-deep .modern-tabs .mat-mdc-tab-header {
        border-bottom: none !important;
        background: var(--bg-card);
      }

      ::ng-deep .modern-tabs .mat-mdc-tab-labels {
        padding: 0 12px;
      }

      ::ng-deep .modern-tabs .mdc-tab {
        height: 48px;
        padding: 0 20px;
        transition: var(--transition-fast);
      }

      /* Active tab indicator style */
      ::ng-deep .modern-tabs .mdc-tab-indicator__content--underline {
        border-color: var(--primary) !important;
        border-top-width: 3px !important;
        border-radius: 3px 3px 0 0;
      }

      ::ng-deep .modern-tabs .mdc-tab--active .mdc-tab__text-label {
        color: var(--primary) !important;
      }

      ::ng-deep .modern-tabs .mdc-tab__text-label {
        font-weight: 600 !important;
        font-size: 0.85rem !important;
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-primary) !important;
        transition: var(--transition-fast);
      }

      .tab-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .tab-body {
        max-height: 400px;
        overflow-y: auto;
      }

      .flex {
        display: flex;
      }
      .flex-between {
        display: flex;
        justify-content: space-between;
      }
      .align-baseline {
        align-items: baseline;
      }
      .align-center {
        align-items: center;
      }
      .gap-8 {
        gap: 8px;
      }
      .gap-12 {
        gap: 12px;
      }
      .gap-16 {
        gap: 16px;
      }
      .p-20 {
        padding: 20px;
      }
      .p-8 {
        padding: 8px;
      }
      .mt-20 {
        margin-top: 20px;
      }
      .text-center {
        text-align: center;
      }
      .text-muted {
        color: var(--text-secondary);
      }

      .close-btn {
        color: var(--text-secondary);
        transition: var(--transition-fast);
      }

      .close-btn:hover {
        color: var(--danger);
        background: rgba(220, 38, 38, 0.1);
        transform: rotate(90deg);
      }
    `,
  ],
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
