import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmIcon?: string;
  cancelIcon?: string;
  isDestructive?: boolean;
}

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationPopupComponent {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  confirmIcon: string;
  cancelIcon: string;
  isDestructive: boolean;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationData | null
  ) {
    this.title = data?.title || 'Confirm Action';
    this.message = data?.message || 'Are you sure you want to proceed?';
    this.confirmText = data?.confirmText || 'Confirm';
    this.cancelText = data?.cancelText || 'Cancel';
    this.confirmIcon = data?.confirmIcon || '';
    this.cancelIcon = data?.cancelIcon || '';
    this.isDestructive = data?.isDestructive || false;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
