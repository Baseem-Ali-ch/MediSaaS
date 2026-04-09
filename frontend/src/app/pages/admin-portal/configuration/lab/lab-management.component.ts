import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../../../../components/popup/confirmation/confirmation.component';
import { LoaderService } from '../../../../services/loader.service';
import { HttpService } from '../../../../services/http.service';
import { ToastService } from '../../../../services/toast.service';
import { finalize } from 'rxjs';

export interface LabData {
  id?: string;
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
  styleUrls: ['./lab-management.component.css', '../../../../../assets/styles/form.css'],
})
export class LabManagementComponent implements OnInit {
  isEditMode = false;
  isSaving = false;

  originalData: LabData = {
    name: '',
    email: '',
    phone: '',
    registrationNo: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  };
  labData: LabData = { ...this.originalData };
  focus: Record<string, boolean> = {};

  constructor(
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getLabDetails();
  }

  getLabDetails() {
    this.loaderService.show();
    this.httpService
      .get('/owner/lab')
      .pipe(
        finalize(() => {
          this.loaderService.hide();
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.originalData = { ...res.data };
          this.labData = { ...res.data };
        },
        error: (err) => {
          this.toastService.show('Failed to fetch lab details.');
        },
      });
  }

  setFocus(field: string) {
    this.focus[field] = true;
  }
  clearFocus(field: string) {
    this.focus[field] = false;
  }

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
    return (
      !!this.labData.name &&
      this.isValidEmail(this.labData.email) &&
      !!this.labData.phone &&
      !!this.labData.address1 &&
      !!this.labData.city &&
      !!this.labData.state &&
      !!this.labData.country &&
      this.isValidPostal(this.labData.postalCode)
    );
  }

  numericOnly(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
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
          isDestructive: true,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
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
    const labId = this.labData.id;

    if (!labId) {
      this.isSaving = false;
      this.toastService.show('Lab ID is missing.');
      return;
    }

    this.httpService
      .patch(`/owner/lab/${labId}`, this.labData)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.isEditMode = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.originalData = { ...this.labData };
          this.toastService.show('Lab details updated successfully');
        },
        error: (err) => {
          this.toastService.show('Failed to update lab details');
        },
      });
  }
}
