import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmationPopupComponent } from '../../../../components/popup/confirmation/confirmation.component';
import { LoaderService } from '../../../../services/loader.service';
import { HttpService } from '../../../../services/http.service';
import { ALL_COUNTRIES, STATES_MAP } from '../../../../constants/location.constants';

export interface BranchData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  status: 'Active' | 'Inactive';
  isMain: boolean;
}

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule, MatSelectModule],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css',
})
export class BranchesComponent implements OnInit {
  branches: BranchData[] = [];
  searchQuery: string = '';
  filterStatus: 'All' | 'Active' | 'Inactive' = 'All';
  isPanelOpen = false;
  editMode = false;
  isSubmitting = false;
  toastMessage = '';
  toastIsError = false;
  branchModel: BranchData = this.getEmptyModel();
  originalModel: BranchData = this.getEmptyModel();
  focus: Record<string, boolean> = {};
  countrySearch: string = '';
  stateSearch: string = '';
  allCountries = ALL_COUNTRIES;
  statesMap = STATES_MAP;

  constructor(
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getBranchList();
  }

  getBranchList() {
    this.loaderService.show();
    this.httpService.get('/admin/branch').subscribe({
      next: (res: any) => {
        this.branches = [...res.data];
      },
      error: (err) => {
        this.showToast('Failed to fetch branch details.', true);
      },
      complete: () => {
        this.loaderService.hide();
        this.cdr.detectChanges();
      },
    });
  }

  getFilteredCountries(): string[] {
    if (!this.countrySearch) return this.allCountries;
    return this.allCountries.filter((c) =>
      c.toLowerCase().includes(this.countrySearch.toLowerCase()),
    );
  }

  getFilteredStates(): string[] {
    const states = this.statesMap[this.branchModel.country] || [];
    if (!this.stateSearch) return states;
    return states.filter((s) => s.toLowerCase().includes(this.stateSearch.toLowerCase()));
  }

  onCountryChange() {
    this.branchModel.state = ''; // reset state when country changes
  }

  filteredBranches(): BranchData[] {
    let result = this.branches;

    if (this.filterStatus !== 'All') {
      result = result.filter((b) => b.status === this.filterStatus);
    }

    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q),
      );
    }
    return result;
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterStatus = 'All';
  }

  getEmptyModel(): BranchData {
    return {
      id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      status: 'Active',
      isMain: false,
    };
  }

  openAddPanel() {
    this.editMode = false;
    this.branchModel = this.getEmptyModel();
    this.originalModel = { ...this.branchModel };
    this.isPanelOpen = true;
  }

  openEditPanel(branch: BranchData) {
    this.editMode = true;
    this.branchModel = { ...branch };
    this.originalModel = { ...branch };
    this.isPanelOpen = true;
  }

  closePanel() {
    this.isPanelOpen = false;
  }

  setFocus(field: string) {
    this.focus[field] = true;
  }
  clearFocus(field: string) {
    this.focus[field] = false;
  }

  hasChanges(): boolean {
    return JSON.stringify(this.branchModel) !== JSON.stringify(this.originalModel);
  }

  isValidEmail(email: string): boolean {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  formValid(): boolean {
    return (
      !!this.branchModel.name &&
      this.isValidEmail(this.branchModel.email) &&
      !!this.branchModel.phone &&
      !!this.branchModel.address &&
      !!this.branchModel.city &&
      !!this.branchModel.country
    );
  }

  numericOnly(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  saveBranch() {
    if (!this.formValid()) return;
    this.isSubmitting = true;

    if (this.editMode) {
      this.httpService.patch(`/admin/branch/${this.branchModel.id}`, this.branchModel).subscribe({
        next: (res: any) => {
          const idx = this.branches.findIndex((b) => b.id === this.branchModel.id);
          if (idx !== -1) {
            this.branches[idx] = { ...this.branchModel };
            this.showToast('Branch updated successfully', false);
          }
        },
        error: (err: any) => {
          this.showToast('Failed to update branch', true);
        },
        complete: () => {
          this.isSubmitting = false;
          this.closePanel();
          this.cdr.detectChanges();
        },
      });
    } else {
      this.httpService.post('/admin/branch', this.branchModel).subscribe({
        next: (res: any) => {
          const newBranch = { ...this.branchModel, ...(res.data || res.branch || {}) };
          if (!newBranch.id && res.id) newBranch.id = res.id;
          this.branches.push(newBranch);
          this.showToast('Branch added successfully', false);
        },
        error: (err: any) => {
          this.showToast('Failed to add branch', true);
        },
        complete: () => {
          this.isSubmitting = false;
          this.closePanel();
          this.cdr.detectChanges();
        },
      });
    }
  }

  deleteBranch(branch: BranchData) {
    if (branch.isMain) return;

    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      data: {
        title: 'Delete Branch',
        message: `Are you sure you want to delete <b>${branch.name}</b>?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.httpService.delete(`/admin/branch/${branch.id}`).subscribe({
          next: () => {
            this.branches = this.branches.filter((b) => b.id !== branch.id);
            this.showToast('Branch deleted successfully', false);
          },
          error: (err: any) => {
            this.showToast('Failed to delete branch', true);
          },
          complete: () => {
            this.cdr.detectChanges();
          },
        });
      }
    });
  }

  showToast(msg: string, isError: boolean) {
    this.toastMessage = msg;
    this.toastIsError = isError;
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }
}
