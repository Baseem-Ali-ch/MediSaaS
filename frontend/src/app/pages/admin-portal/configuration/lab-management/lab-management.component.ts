import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../../../../components/popup/confirmation/confirmation.component';

export interface LabData {
  name: string;
  email: string;
  phone: string;
  registrationNo: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

@Component({
  selector: 'app-lab-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule],
  templateUrl: './lab-management.component.html',
  styleUrl: './lab-management.component.css'
})
export class LabManagementComponent implements OnInit {
  isEditMode = false;
  isSaving = false;

  toastMessage = '';
  toastIsError = false;

  originalData: LabData = {
    name: 'MediSaaS Central Lab',
    email: 'lab@medisaas.com',
    phone: '+1 (555) 123-4567',
    registrationNo: 'REG-991A4B',
    address1: '123 Medical Drive',
    address2: 'Suite 400',
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
    postalCode: '94110'
  };

  labData: LabData = { ...this.originalData };

  focus: Record<string, boolean> = {};

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    // Initial fetch mock
  }

  setFocus(field: string) { this.focus[field] = true; }
  clearFocus(field: string) { this.focus[field] = false; }

  enableEditMode() {
    this.isEditMode = true;
  }

  hasChanges(): boolean {
    return JSON.stringify(this.originalData) !== JSON.stringify(this.labData);
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPostal(code: string): boolean {
    return /^[0-9]{1,10}$/.test(code) || code === '';
  }

  labFormValid(): boolean {
    return !!this.labData.name &&
      this.isValidEmail(this.labData.email) &&
      !!this.labData.phone &&
      !!this.labData.address1 &&
      !!this.labData.city &&
      !!this.labData.state &&
      !!this.labData.country &&
      this.isValidPostal(this.labData.postalCode);
  }

  numericOnly(event: KeyboardEvent) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  discardChanges() {
    if (this.hasChanges()) {
      const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
        width: '400px',
        data: {
          title: 'Discard Changes',
          message: 'You have unsaved changes. Are you sure you want to discard them?',
          confirmText: 'Discard',
          cancelText: 'Keep Editing',
          isDestructive: true
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.labData = { ...this.originalData };
          this.isEditMode = false;
        }
      });
    } else {
      this.isEditMode = false;
    }
  }

  saveChanges() {
    if (!this.labFormValid()) return;

    this.isSaving = true;
    setTimeout(() => {
      this.originalData = { ...this.labData };
      this.isSaving = false;
      this.isEditMode = false;
      this.showToast('Lab details updated successfully', false);
    }, 800);
  }

  showToast(msg: string, isError: boolean) {
    this.toastMessage = msg;
    this.toastIsError = isError;
    setTimeout(() => { this.toastMessage = ''; }, 3500);
  }
}
