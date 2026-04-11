import { ViewChild, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { ConfirmationPopupComponent } from '../../../../components/popup/confirmation/confirmation.component';
import { PatientDetailsPopupComponent } from './patient-details.popup';
import { LoaderService } from '../../../../services/loader.service';
import { HttpService } from '../../../../services/http.service';
import { finalize } from 'rxjs';
import { ToastService } from '../../../../services/toast.service';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';

export interface Patient {
  id: string;
  patientId: string;
  name: string;
  gender: string;
  dateOfBirth: Date | null;
  age: number | null;
  phone: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  notes: string;
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    PaginationComponent,
  ],
  templateUrl: './patients.component.html',
  styleUrls: [
    './patients.component.css',
    '../../../../../assets/styles/form.css',
    '../../../../../assets/styles/table.css',
  ],
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];

  displayedColumns = ['patientId', 'fullName', 'phone', 'age', 'gender', 'bloodGroup', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;

  searchQuery: string = '';
  filterGender: string = 'All';
  currentPage: number = 1;
  pageSize: number = 10;
  totalFilteredItems: number = 0;

  isPanelOpen = false;
  editMode = false;
  isSubmitting = false;

  patientModel: Patient = this.getEmptyModel();
  originalModel: Patient = this.getEmptyModel();

  maxDate = new Date();

  focus: Record<string, boolean> = {};

  constructor(
    private dialog: MatDialog,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getPatientsList();
  }

  getPatientsList() {
    this.loaderService.show();
    this.httpService
      .get('/shared/patients')
      .pipe(
        finalize(() => {
          this.loaderService.hide();
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.patients = res.data;
          this.updateTotalCount();
        },
        error: (err) => {
          this.toastService.show('Failed to fetch patients list.');
        },
      });
  }

  getFilteredPatients(): Patient[] {
    let result = [...this.patients];

    if (this.filterGender !== 'All') {
      result = result.filter((p) => p.gender === this.filterGender);
    }

    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.patientId.toLowerCase().includes(q) ||
          p.phone.includes(q),
      );
    }

    this.totalFilteredItems = result.length;

    const start = (this.currentPage - 1) * this.pageSize;
    return result.slice(start, start + this.pageSize);
  }

  updateTotalCount() {
    this.totalFilteredItems = this.patients.length;
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterGender = 'All';
    this.currentPage = 1;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.cdr.detectChanges();
  }

  getEmptyModel(): Patient {
    return {
      id: '',
      patientId: '',
      name: '',
      gender: '',
      dateOfBirth: null,
      age: null,
      phone: '',
      address: '',
      bloodGroup: '',
      emergencyContact: '',
      notes: '',
    };
  }

  setFocus(field: string) {
    this.focus[field] = true;
  }
  clearFocus(field: string) {
    this.focus[field] = false;
  }

  openAddPanel() {
    this.editMode = false;
    this.patientModel = this.getEmptyModel();
    this.originalModel = { ...this.patientModel };
    this.isPanelOpen = true;
  }

  openEditPanel(patient: Patient) {
    this.editMode = true;
    this.patientModel = { ...patient };
    this.originalModel = { ...patient };
    this.isPanelOpen = true;
  }

  closePanel() {
    this.isPanelOpen = false;
  }

  openPatientDetails(patient: Patient) {
    const dialogRef = this.dialog.open(PatientDetailsPopupComponent, {
      width: '605px',
      panelClass: 'sharp-dialog',
      data: { patient },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.action === 'edit') {
        this.openEditPanel(result.patient);
      }
    });
  }

  deletePatient(patient: Patient) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      panelClass: 'sharp-dialog',
      data: {
        title: 'Delete Patient',
        message: `Are you sure you want to delete patient <b>${patient.name}</b>?`,
        type: 'error',
        confirmText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loaderService.show();
        this.httpService
          .delete(`/shared/patients/${patient.id}`)
          .pipe(
            finalize(() => {
              this.loaderService.hide();
              this.cdr.detectChanges();
            }),
          )
          .subscribe({
            next: (res: any) => {
              if (res.success) {
                this.patients = this.patients.filter((p) => p.id !== patient.id);
                this.updateTotalCount();
                this.toastService.show('Patient deleted successfully');
              } else {
                this.toastService.show(res.message || 'Failed to delete patient');
              }
            },
            error: (err) => {
              this.toastService.show('Failed to delete patient');
            },
          });
      }
    });
  }

  onDateOfBirthChange(dob: Date): void {
    if (!dob) return;
    this.patientModel.age = this.calculateAge(dob);
  }

  calculateAge(dob: Date): number {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  isValidPhone(phone: string): boolean {
    if (!phone) return false;
    return phone.replace(/\D/g, '').length >= 10;
  }

  formValid(): boolean {
    return !!(
      !this.isSubmitting &&
      this.patientModel.name &&
      this.patientModel.gender &&
      this.patientModel.dateOfBirth &&
      this.patientModel.phone &&
      this.isValidPhone(this.patientModel.phone)
    );
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  hasChanges(): boolean {
    return JSON.stringify(this.patientModel) !== JSON.stringify(this.originalModel);
  }

  savePatient() {
    if (!this.formValid()) return;
    this.isSubmitting = true;

    // Map component model to DTO
    const patientDTO = {
      name: this.patientModel.name,
      phone: this.patientModel.phone,
      gender: this.patientModel.gender,
      dateOfBirth: this.patientModel.dateOfBirth
        ? this.formatDate(this.patientModel.dateOfBirth)
        : undefined,
      age: this.patientModel.age,
      address: this.patientModel.address,
      bloodGroup: this.patientModel.bloodGroup,
      emergencyContact: this.patientModel.emergencyContact,
      notes: this.patientModel.notes,
    };

    if (this.editMode) {
      this.httpService
        .put(`/shared/patients/${this.patientModel.id}`, patientDTO)
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
            this.cdr.detectChanges();
          }),
        )
        .subscribe({
          next: (res: any) => {
            if (res.success) {
              const idx = this.patients.findIndex((p) => p.id === this.patientModel.id);
              if (idx !== -1) {
                this.patients[idx] = { ...res.data };
                this.patients = [...this.patients];
                this.toastService.show('Patient updated successfully');
              }
              this.closePanel();
            } else {
              this.toastService.show(res.message || 'Failed to update patient');
            }
          },
          error: (err) => {
            this.toastService.show('Failed to update patient');
          },
        });
    } else {
      this.httpService
        .post('/shared/patients', patientDTO)
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
            this.cdr.detectChanges();
          }),
        )
        .subscribe({
          next: (res: any) => {
            if (res.success) {
              const newPatient = {
                ...res.data,
              };
              this.patients = [...this.patients, newPatient];
              this.updateTotalCount();
              this.toastService.show('Patient created successfully');
              this.closePanel();
            } else {
              this.toastService.show(res.message || 'Failed to create patient');
            }
          },
          error: (err) => {
            this.toastService.show('Failed to create patient');
          },
        });
    }
  }
}
