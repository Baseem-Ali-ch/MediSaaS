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

export interface StaffData {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Doctor' | 'Reception' | 'Lab Technician';
  branch: string;
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

  // Table sorting & pagination
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';
  filterRole: string = 'All';

  currentPage: number = 1;
  pageSize: number = 10;
  totalFilteredItems: number = 0;

  // Panel State
  isPanelOpen = false;
  editMode = false;
  isSubmitting = false;
  staffModel: StaffData = this.getEmptyModel();
  originalModel: StaffData = this.getEmptyModel();
  focus: Record<string, boolean> = {};

  // Roles & Branches
  roles = ['Admin', 'Doctor', 'Reception', 'Lab Technician'];
  branches = ['Main Branch', 'City Center', 'Suburban Lab'];

  constructor(
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.getStaffList();
  }

  getStaffList() {
    this.loaderService.show();
    // Simulate or call real API
    // this.httpService.get('/admin/staff').subscribe(...)

    // Mock Data
    setTimeout(() => {
      this.staffList = [
        {
          id: '1',
          staffId: 'STF-001',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          role: 'Doctor',
          branch: 'Main Branch',
          gender: 'Male',
          status: 'Active',
        },
        {
          id: '2',
          staffId: 'STF-002',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '0987654321',
          role: 'Admin',
          branch: 'City Center',
          gender: 'Female',
          status: 'Active',
        },
        {
          id: '3',
          staffId: 'STF-003',
          name: 'Mark Wilson',
          email: 'mark@example.com',
          phone: '5554443332',
          role: 'Reception',
          branch: 'Main Branch',
          gender: 'Male',
          status: 'Active',
        },
        {
          id: '4',
          staffId: 'STF-004',
          name: 'Sarah Parker',
          email: 'sarah@example.com',
          phone: '1112223334',
          role: 'Lab Technician',
          branch: 'Suburban Lab',
          gender: 'Female',
          status: 'Active',
        },
        {
          id: '5',
          staffId: 'STF-005',
          name: 'Alex Johnson',
          email: 'alex@example.com',
          phone: '4445556667',
          role: 'Doctor',
          branch: 'City Center',
          gender: 'Other',
          status: 'Inactive',
        },
      ];
      this.updateTotalCount();
      this.loaderService.hide();
      this.cdr.detectChanges();
    }, 500);
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

    // Manual pagination for mock data
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
      role: 'Reception',
      branch: 'Main Branch',
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
      data: { staff },
    });
  }

  deleteStaff(staff: StaffData) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      data: {
        title: 'Delete Staff Member',
        message: `Are you sure you want to remove <b>${staff.name}</b> from the system?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.staffList = this.staffList.filter((s) => s.id !== staff.id);
        this.toastService.show('Staff member deleted successfully');
        this.cdr.detectChanges();
      }
    });
  }

  saveStaff() {
    if (!this.formValid()) return;
    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      if (this.editMode) {
        const idx = this.staffList.findIndex((s) => s.id === this.staffModel.id);
        if (idx !== -1) {
          this.staffList[idx] = { ...this.staffModel };
          this.toastService.show('Staff updated successfully');
        }
      } else {
        const newStaff = {
          ...this.staffModel,
          id: Date.now().toString(),
          staffId: 'STF-' + Math.floor(100 + Math.random() * 900),
        };
        this.staffList.push(newStaff);
        this.toastService.show('Staff added successfully');
      }
      this.isSubmitting = false;
      this.isPanelOpen = false;
      this.cdr.detectChanges();
    }, 1000);
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
