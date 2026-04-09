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
  type?: 'success' | 'info' | 'warn' | 'error';
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
  confirmIcon: string = '';
  cancelIcon: string = '';
  isDestructive: boolean;
  type: string;
  icon: string = 'help_outline';

  constructor(
    public dialogRef: MatDialogRef<ConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationData | null
  ) {
    this.type = data?.type || 'info';
    this.title = data?.title || this.getDefaultTitle(this.type);
    this.message = data?.message || 'Are you sure you want to proceed?';
    this.confirmText = data?.confirmText || 'Confirm';
    this.cancelText = data?.cancelText || 'Cancel';
    this.confirmIcon = data?.confirmIcon || '';
    this.cancelIcon = data?.cancelIcon || '';
    this.isDestructive = data?.isDestructive || false;
    this.icon = this.getIconByType(this.type);
  }

  private getDefaultTitle(type: string): string {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warn': return 'Warning';
      case 'info': return 'Information';
      default: return 'Confirm Action';
    }
  }

  private getIconByType(type: string): string {
    if (this.isDestructive) return 'warning';
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warn': return 'warning';
      case 'info': return 'info';
      default: return 'help_outline';
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
