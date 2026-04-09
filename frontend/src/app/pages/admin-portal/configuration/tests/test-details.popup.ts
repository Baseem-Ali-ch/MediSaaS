import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-test-details-popup',
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
              <mat-icon>science</mat-icon>
            </div>
          </div>
          <div class="header-info">
            <div class="flex align-center gap-8">
              <h2 class="test-title">{{ test.testName }}</h2>
              <span class="id-badge">{{ test.testCode }}</span>
            </div>
            <p class="text-muted">{{ test.category }} • {{ test.sampleType }}</p>
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
              <mat-icon class="tab-icon">analytics</mat-icon>
              Details
            </ng-template>
            <div class="tab-body p-20">
              <div class="info-grid">
                <div class="info-group">
                  <h3 class="section-subtitle">Basic Info</h3>
                  <div class="detail-item">
                    <label>Short Name</label>
                    <p>{{ test.shortName || '—' }}</p>
                  </div>
                  <div class="detail-item">
                    <label>Price</label>
                    <p>{{ test.price | currency: 'INR' }}</p>
                  </div>
                  <div class="detail-item">
                    <label>Status</label>
                    <p>
                      <span class="role-badge" [class.admin]="test.status === 'Active'">{{
                        test.status
                      }}</span>
                    </p>
                  </div>
                </div>

                <div class="info-group">
                  <h3 class="section-subtitle">Clinical Config</h3>
                  <div class="detail-item">
                    <label>Result Type</label>
                    <p>{{ test.resultType }}</p>
                  </div>
                  @if (test.resultType === 'Numeric') {
                    <div class="detail-item">
                      <label>Range & Unit</label>
                      <p>{{ test.referenceRange }} {{ test.unit }}</p>
                    </div>
                  }
                  <div class="detail-item">
                    <label>Method</label>
                    <p>{{ test.method || '—' }}</p>
                  </div>
                  <div class="detail-item">
                    <label>Turnaround Time</label>
                    <p>{{ test.turnaroundTime || '—' }}</p>
                  </div>
                </div>
              </div>

              <div class="info-group mt-20">
                <h3 class="section-subtitle">Instructions & Description</h3>
                <div class="detail-item">
                  <label>Fasting Required</label>
                  <p>{{ test.fastingRequired ? 'Yes' : 'No' }}</p>
                </div>
                <div class="notes-box">
                  <strong>Prep Notes:</strong> {{ test.preparationNotes || 'None' }} <br /><br />
                  <strong>Description:</strong> {{ test.description || 'None' }}
                </div>
              </div>

              @if (
                test.resultType === 'Multi Parameter' &&
                test.parameters &&
                test.parameters.length > 0
              ) {
                <div class="info-group mt-20">
                  <h3 class="section-subtitle">Parameters ({{ test.parameters.length }})</h3>
                  <div class="parameter-list-view">
                    <table class="simple-info-table">
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Unit</th>
                          <th>Ref. Range</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let p of test.parameters">
                          <td>{{ p.name }}</td>
                          <td>{{ p.unit }}</td>
                          <td>{{ p.referenceRange }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              }
            </div>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">history</mat-icon>
              Activity Log
            </ng-template>
            <div class="tab-body p-20">
              <div class="history-list">
                @for (log of activityLogs; track log) {
                  <div class="log-row flex align-center gap-12 p-12">
                    <div class="log-icon-wrap" [ngClass]="log.type">
                      <mat-icon>{{ log.icon }}</mat-icon>
                    </div>
                    <div class="log-content">
                      <div class="flex-between align-baseline">
                        <p class="log-msg">{{ log.action }}</p>
                        <span class="log-time">{{ log.date | date: 'short' }}</span>
                      </div>
                      <p class="log-user">
                        by <span>{{ log.user }}</span>
                      </p>
                    </div>
                  </div>
                }
                @if (activityLogs.length === 0) {
                  <div class="empty-state p-24 text-center">
                    <mat-icon>history_toggle_off</mat-icon>
                    <p>No activity logs found for this test.</p>
                  </div>
                }
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styleUrls: ['../../../../../assets/styles/popup.css'],
})
export class TestDetailsPopupComponent {
  test: any;
  activityLogs = [
    {
      date: new Date(),
      action: 'Test Configuration Updated',
      user: 'Admin User',
      icon: 'edit_note',
      type: 'update',
    },
    {
      date: new Date(Date.now() - 3600000 * 24),
      action: 'Pricing Changed',
      user: 'Manager',
      icon: 'payments',
      type: 'update',
    },
    {
      date: new Date(Date.now() - 86400000 * 5),
      action: 'Test Created',
      user: 'System',
      icon: 'add_circle',
      type: 'create',
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<TestDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.test = data.test;
  }

  close(): void {
    this.dialogRef.close();
  }
}
