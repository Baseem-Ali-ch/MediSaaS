import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-staff-details-popup',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, MatDividerModule, MatTabsModule],
  template: `
    <div class="popup-container modern-card">
      <!-- Header -->
      <div class="popup-header p-20 flex-between">
        <div class="flex gap-16 align-center">
          <div class="avatar-container">
            @if (staff.photo) {
              <img [src]="staff.photo" [alt]="staff.name" class="avatar-img" />
            } @else {
              <div class="avatar-placeholder">
                <mat-icon>person</mat-icon>
              </div>
            }
          </div>
          <div class="header-info">
            <h2 class="staff-title">{{ staff.name }}</h2>
            <p class="staff-id-badge">ID: {{ staff.refId }}</p>
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
          <!-- Overview Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">grid_view</mat-icon>
              Overview
            </ng-template>
            <div class="tab-body p-20">
              <div class="grid-2 gap-16">
                <div class="detail-item">
                  <label>Email</label>
                  <p>{{ staff.email }}</p>
                </div>
                <div class="detail-item">
                  <label>Phone</label>
                  <p>{{ staff.phone }}</p>
                </div>
                <div class="detail-item">
                  <label>Role</label>
                  <p>
                    <span class="role-badge" [class.admin]="staff.role === 'Admin'">{{
                      staff.role
                    }}</span>
                  </p>
                </div>
                <div class="detail-item">
                  <label>Branch</label>
                  <p>{{ staff.branch.name }}</p>
                </div>
                <div class="detail-item">
                  <label>Gender</label>
                  <p>{{ staff.gender }}</p>
                </div>
                <div class="detail-item">
                  <label>Status</label>
                  <p>
                    <span class="status-indicator" [class.active]="staff.status === 'Active'"></span>
                    {{ staff.status }}
                  </p>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Logs Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">history</mat-icon>
              Logs
            </ng-template>
            <div class="tab-body p-20">
              <div class="logs-list">
                @if (staffLogs.length > 0) {
                  @for (log of staffLogs; track log.timestamp) {
                    <div class="log-row flex align-center gap-12 p-8">
                      <div class="log-icon-wrap" [ngClass]="log.type">
                        <mat-icon>{{ log.icon }}</mat-icon>
                      </div>
                      <div class="log-content">
                        <p class="log-msg">{{ log.message }}</p>
                        <span class="log-time">{{ log.timestamp | date: 'shortTime' }}</span>
                      </div>
                    </div>
                  }
                } @else {
                  <div class="empty-logs text-center p-16 text-muted">No activity recorded.</div>
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
export class StaffDetailsPopupComponent {
  staff: any;
  staffLogs: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<StaffDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.staff = data.staff;
    this.staffLogs = [
      {
        message: 'Logged in to system',
        timestamp: new Date(Date.now() - 3600000),
        type: 'login',
        icon: 'login',
      },
      {
        message: 'Updated patient record #PT-904',
        timestamp: new Date(Date.now() - 15000000),
        type: 'update',
        icon: 'edit_note',
      },
      {
        message: 'Generated lab report #LB-102',
        timestamp: new Date(Date.now() - 25000000),
        type: 'create',
        icon: 'add_task',
      },
    ];
  }

  close(): void {
    this.dialogRef.close();
  }
}
