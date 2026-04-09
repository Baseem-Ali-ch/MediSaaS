import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { StaffDetailsPopupComponent } from './staff-details.popup';
import { ConfirmationPopupComponent } from '../../../../components/popup/confirmation/confirmation.component';
import { LoaderService } from '../../../../services/loader.service';
import { HttpService } from '../../../../services/http.service';
import { ToastService } from '../../../../services/toast.service';
import { finalize } from 'rxjs';

export interface StaffData {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  branch: number;
  gender: 'Male' | 'Female' | 'Other';
  photo?: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    PaginationComponent,
  ],
  templateUrl: './staff-management.component.html',
  styleUrls: [
    './staff-management.component.css',
    '../../../../../assets/styles/form.css',
    '../../../../../assets/styles/table.css',
  ],
})
export class StaffManagementComponent implements OnInit {
  staffList: StaffData[] = [];
  displayedColumns: string[] = ['staffId', 'name', 'phone', 'role', 'branch', 'email', 'actions'];
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';
  filterRole: string = 'All';
  currentPage: number = 1;
  pageSize: number = 10;
  totalFilteredItems: number = 0;
  isPanelOpen = false;
  editMode = false;
  isSubmitting = false;
  staffModel: StaffData = this.getEmptyModel();
  originalModel: StaffData = this.getEmptyModel();
  focus: Record<string, boolean> = {};
  branches: any[] = [];
  roles = [
    { label: 'Staff', key: 'STAFF' },
    { label: 'Reception', key: 'RECEPTIONIST' },
    { label: 'Lab Technician', key: 'TECHNICIAN' },
    { label: 'Branch Manager', key: 'BRANCH_MANAGER' },
  ];

  constructor(
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.getStaffList();
    this.getBranchList();
  }

  getStaffList() {
    this.loaderService.show();
    this.httpService
      .get('/owner/staff')
      .pipe(
        finalize(() => {
          this.loaderService.hide();
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.staffList = [...res.data];
        },
        error: (err) => {
          this.toastService.show('Failed to fetch staff details.');
        },
      });
  }

  getBranchList() {
    this.httpService
      .get('/owner/branch')
      .pipe(
        finalize(() => {
          this.loaderService.hide();
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.branches = [...res.data];
        },
        error: (err) => {
          this.toastService.show('Failed to fetch branch details.');
        },
      });
  }

  getFilteredStaff(): StaffData[] {
    let result = [...this.staffList];

    if (this.filterRole !== 'All') {
      result = result.filter((s) => s.role === this.filterRole);
    }

    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.staffId.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q),
      );
    }

    this.totalFilteredItems = result.length;

    const start = (this.currentPage - 1) * this.pageSize;
    return result.slice(start, start + this.pageSize);
  }

  updateTotalCount() {
    this.totalFilteredItems = this.staffList.length;
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterRole = 'All';
    this.currentPage = 1;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.cdr.detectChanges();
  }

  getEmptyModel(): StaffData {
    return {
      id: '',
      staffId: '',
      name: '',
      email: '',
      phone: '',
      role: 'STAFF',
      branch: 1,
      gender: 'Male',
      status: 'Active',
    };
  }

  openAddPanel() {
    this.editMode = false;
    this.staffModel = this.getEmptyModel();
    this.originalModel = { ...this.staffModel };
    this.isPanelOpen = true;
  }

  openEditPanel(staff: StaffData) {
    this.editMode = true;
    this.staffModel = { ...staff };
    this.originalModel = { ...staff };
    this.isPanelOpen = true;
  }

  closePanel() {
    this.isPanelOpen = false;
  }

  openStaffDetails(staff: StaffData) {
    this.dialog.open(StaffDetailsPopupComponent, {
      width: '550px',
      panelClass: 'sharp-dialog',
      data: { staff },
    });
  }

  deleteStaff(staff: StaffData) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      panelClass: 'sharp-dialog',
      data: {
        type: 'error',
        title: 'Delete Staff Member',
        message: `Are you sure you want to remove <b>${staff.name}</b> from the system?`,
        confirmText: 'Delete',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        finalize(() => {
          this.cdr.detectChanges();
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.httpService.delete(`/owner/branch/${staff.id}`).subscribe({
            next: () => {
              this.staffList = this.staffList.filter((b) => b.id !== staff.id);
              this.toastService.show('Staff deleted successfully');
            },
            error: (err: any) => {
              this.toastService.show('Failed to delete staff');
            },
          });
        }
      });
  }

  saveStaff() {
    if (!this.formValid()) return;
    this.isSubmitting = true;

    if (this.editMode) {
      this.httpService
        .patch(`/owner/staff/${this.staffModel.id}`, this.staffModel)
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
            this.cdr.detectChanges();
          }),
        )
        .subscribe({
          next: (res: any) => {
            if (!res.success) {
              this.toastService.show(res.message || 'Failed to update staff');
              return;
            }

            if (res.success) {
              const idx = this.staffList.findIndex((s) => s.id === this.staffModel.id);
              if (idx !== -1) {
                this.staffList[idx] = { ...this.staffModel };
                this.toastService.show('Staff updated successfully');
              }
              this.closePanel();
            }
          },
          error: (err: any) => {
            this.toastService.show('Failed to update staff');
          },
        });
    } else {
      this.httpService
        .post('/owner/staff', this.staffModel)
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
            this.cdr.detectChanges();
          }),
        )
        .subscribe({
          next: (res: any) => {
            if (!res.success) {
              this.toastService.show(res.message || 'Failed to add staff');
              return;
            }

            if (res.success) {
              const newStaff = { ...this.staffModel, ...(res.data || {}) };
              if (!newStaff.id && res.id) newStaff.id = res.id;
              this.staffList.push(newStaff);
              this.toastService.show('Staff added successfully');
              this.closePanel();
            }
          },
          error: (err: any) => {
            this.toastService.show('Failed to add staff');
          },
        });
    }
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.staffModel.photo = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  formValid(): boolean {
    return (
      !!this.staffModel.name &&
      !!this.staffModel.email &&
      !!this.staffModel.phone &&
      !!this.staffModel.role
    );
  }

  hasChanges(): boolean {
    return JSON.stringify(this.staffModel) !== JSON.stringify(this.originalModel);
  }

  setFocus(field: string) {
    this.focus[field] = true;
  }
  clearFocus(field: string) {
    this.focus[field] = false;
  }
}
