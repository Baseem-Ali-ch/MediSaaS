import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-booking-details-popup',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, MatDividerModule, MatTabsModule],
  template: `
    <div class="popup-container modern-card">
      <!-- Header -->
      <div class="popup-header p-20 flex-between">
        <div class="flex gap-16 align-center">
          <div class="avatar-container">
            <div class="avatar-placeholder">
              <mat-icon>shopping_cart</mat-icon>
            </div>
          </div>
          <div class="header-info">
            <h2 class="staff-title">{{ booking.bookingNo }}</h2>
            <p class="staff-id-badge">Patient: {{ booking.patientName }}</p>
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
                  <label>Booking Date</label>
                  <p>{{ booking.bookedFor | date }}</p>
                </div>
                <div class="detail-item">
                  <label>Total Amount</label>
                  <p class="font-600">₹{{ booking.totalAmount }}</p>
                </div>
                <div class="detail-item">
                  <label>Discount</label>
                  <p>{{ booking.discountValue }} {{ booking.discountType === 'Percentage' ? '%' : '₹' }}</p>
                </div>
                <div class="detail-item">
                  <label>Final Amount</label>
                  <p class="text-primary font-700">₹{{ booking.finalAmount }}</p>
                </div>
                <div class="detail-item">
                  <label>Payment Status</label>
                  <p>
                    <span class="status-badge" [class.completed]="booking.paymentStatus === 'Completed'" 
                          [class.partial]="booking.paymentStatus === 'Partial'"
                          [class.pending]="booking.paymentStatus === 'Pending'">
                      {{ booking.paymentStatus }}
                    </span>
                  </p>
                </div>
                <div class="detail-item">
                  <label>Booking Status</label>
                  <p>
                    <span class="role-badge">{{ booking.bookingStatus }}</span>
                  </p>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Tests Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">science</mat-icon>
              Tests ({{ booking.testsCount }})
            </ng-template>
            <div class="tab-body p-20">
              <div class="tests-list">
                @for (test of booking.tests; track test.testName) {
                  <div class="flex-between p-12 border-b">
                    <span>{{ test.testName }}</span>
                    <span class="font-600">₹{{ test.price }}</span>
                  </div>
                }
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styleUrls: ['../../../../assets/styles/popup.css'],
})
export class BookingDetailsPopupComponent {
  booking: any;

  constructor(
    public dialogRef: MatDialogRef<BookingDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.booking = data.booking;
  }

  close(): void {
    this.dialogRef.close();
  }
}
