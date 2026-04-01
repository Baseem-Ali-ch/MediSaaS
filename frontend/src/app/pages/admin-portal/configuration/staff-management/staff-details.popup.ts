import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-staff-details-popup',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, MatDividerModule],
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
            <p class="staff-id-badge">ID: {{ staff.staffId }}</p>
          </div>
        </div>
        <button mat-icon-button (click)="close()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="popup-body scrollable">
        <!-- Details Section -->
        <section class="details-section p-20">
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
              <p>{{ staff.branch }}</p>
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
        </section>

        <mat-divider></mat-divider>

        <!-- Logs Section -->
        <section class="logs-section p-20">
          <h3 class="section-title">Recent Activity</h3>
          <div class="logs-list mt-12">
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
        </section>
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
        transition: var(--transition);
      }
      .popup-header {
        border-bottom: 1px solid var(--border);
        background: var(--bg-main);
      }
      .avatar-container {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        background: var(--bg-card);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--border);
        transition: var(--transition-fast);
      }
      .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .avatar-placeholder mat-icon {
        color: var(--text-secondary);
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
      .staff-title {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text-primary);
        font-weight: 700;
      }
      .staff-id-badge {
        margin: 2px 0 0;
        font-size: 0.8rem;
        color: var(--text-secondary);
        font-weight: 500;
      }

      .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      .detail-item {
        margin-bottom: 4px;
      }
      .detail-item label {
        font-size: 0.7rem;
        display: block;
        margin-bottom: 2px;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
      }
      .detail-item p {
        margin: 0;
        font-weight: 500;
        color: var(--text-primary);
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--text-secondary);
        opacity: 0.5;
      }
      .status-indicator.active {
        background: var(--success);
        opacity: 1;
        box-shadow: 0 0 8px var(--success);
      }

      .role-badge {
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 700;
        background: rgba(34, 197, 94, 0.1);
        color: var(--success);
        text-transform: uppercase;
      }
      .role-badge.admin {
        background: rgba(56, 189, 248, 0.1);
        color: var(--info);
      }

      .scrollable {
        max-height: 380px;
        overflow-y: auto;
      }

      .section-title {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--primary);
      }

      .log-row {
        border-radius: 6px;
        background: transparent;
        transition: var(--transition-fast);
      }
      .log-row:hover {
        background: var(--bg-main);
      }
      .log-icon-wrap {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .log-icon-wrap mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .log-icon-wrap.login {
        background: rgba(34, 197, 94, 0.1);
        color: var(--success);
      }
      .log-icon-wrap.update {
        background: rgba(202, 138, 4, 0.1);
        color: var(--warning);
      }
      .log-icon-wrap.create {
        background: rgba(2, 132, 199, 0.1);
        color: var(--info);
      }

      .log-msg {
        margin: 0;
        font-size: 0.8rem;
        color: var(--text-primary);
        font-weight: 500;
      }
      .log-time {
        font-size: 0.7rem;
        color: var(--text-secondary);
        font-weight: 600;
      }

      .flex {
        display: flex;
      }
      .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .align-center {
        align-items: center;
      }
      .gap-16 {
        gap: 16px;
      }
      .gap-12 {
        gap: 12px;
      }
      .gap-8 {
        gap: 8px;
      }
      .p-20 {
        padding: 20px;
      }
      .p-12 {
        padding: 12px;
      }
      .p-8 {
        padding: 8px;
      }
      .mt-12 {
        margin-top: 12px;
      }
      .text-center {
        text-align: center;
      }
      .text-muted {
        color: var(--text-secondary);
        font-size: 0.8rem;
      }
      .close-btn {
        color: var(--text-secondary);
        transition: var(--transition-fast);
      }
      .close-btn:hover {
        color: var(--danger);
        transform: rotate(90deg);
      }
    `,
  ],
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
