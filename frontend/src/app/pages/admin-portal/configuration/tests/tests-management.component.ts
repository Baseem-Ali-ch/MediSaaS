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
import { ConfirmationPopupComponent } from '../../../../components/popup/confirmation/confirmation.component';
import { LoaderService } from '../../../../services/loader.service';
import { HttpService } from '../../../../services/http.service';
import { ToastService } from '../../../../services/toast.service';
import { finalize } from 'rxjs';
import { TestDetailsPopupComponent } from './test-details.popup';

export interface TestParameter {
  id?: string;
  name: string;
  unit: string;
  referenceRange: string;
  resultType: string;
}

export interface TestData {
  id: string;
  testCode: string;
  testName: string;
  shortName: string;
  category: string;
  sampleType: string;
  price: number;
  status: 'Active' | 'Inactive';

  // Clinical Configuration
  resultType: string;
  unit?: string;
  referenceRange?: string;
  method?: string;
  turnaroundTime?: string;

  // Patient Instructions
  fastingRequired: boolean;
  preparationNotes: string;
  description: string;

  // Parameters
  parameters: TestParameter[];
}

@Component({
  selector: 'app-tests-management',
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
  templateUrl: './tests-management.component.html',
  styleUrls: [
    './tests-management.component.css',
    '../../../../../assets/styles/form.css',
    '../../../../../assets/styles/table.css',
  ],
})
export class TestsManagementComponent implements OnInit {
  testList: TestData[] = [];
  displayedColumns: string[] = [
    'testCode',
    'testName',
    'category',
    'sampleType',
    'price',
    'resultType',
    'status',
    'actions',
  ];
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';
  filterCategory: string = 'All';
  currentPage: number = 1;
  pageSize: number = 10;
  totalFilteredItems: number = 0;
  isPanelOpen = false;
  editMode = false;
  isSubmitting = false;
  testModel: TestData = this.getEmptyModel();
  originalModel: TestData = this.getEmptyModel();
  focus: Record<string, boolean> = {};

  categories = [
    'Biochemistry',
    'Hematology',
    'Microbiology',
    'Serology',
    'Immunology',
    'Hormones',
    'Urine Analysis',
  ];
  sampleTypes = ['Blood (SST)', 'Blood (EDTA)', 'Blood (Fluoride)', 'Urine', 'Swab', 'Stool'];
  resultTypes = ['Numeric', 'Text', 'Positive/Negative', 'Multi Parameter'];

  constructor(
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.getTestList();
  }

  getTestList() {
    this.loaderService.show();
    this.httpService
      .get('/shared/tests')
      .pipe(
        finalize(() => {
          this.loaderService.hide();
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          if (res.data) {
            this.testList = res.data;
          }
        },
        error: (err) => {
          this.toastService.show('Failed to fetch tests list');
        },
      });
  }

  getFilteredTests(): TestData[] {
    let result = [...this.testList];

    if (this.filterCategory !== 'All') {
      result = result.filter((t) => t.category === this.filterCategory);
    }

    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.testName.toLowerCase().includes(q) ||
          (t.testCode && t.testCode.toLowerCase().includes(q)) ||
          t.shortName.toLowerCase().includes(q),
      );
    }

    this.totalFilteredItems = result.length;

    const start = (this.currentPage - 1) * this.pageSize;
    return result.slice(start, start + this.pageSize);
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterCategory = 'All';
    this.currentPage = 1;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.cdr.detectChanges();
  }

  getEmptyModel(): TestData {
    return {
      id: '',
      testCode: '',
      testName: '',
      shortName: '',
      category: '',
      sampleType: '',
      price: 0,
      status: 'Active',
      resultType: 'Numeric',
      fastingRequired: false,
      preparationNotes: '',
      description: '',
      parameters: [],
    };
  }

  openAddPanel() {
    this.editMode = false;
    this.testModel = this.getEmptyModel();
    this.originalModel = JSON.parse(JSON.stringify(this.testModel));
    this.isPanelOpen = true;
  }

  openEditPanel(test: TestData) {
    this.editMode = true;
    this.testModel = JSON.parse(JSON.stringify(test));
    this.originalModel = JSON.parse(JSON.stringify(test));
    this.isPanelOpen = true;
  }

  closePanel() {
    this.isPanelOpen = false;
  }

  openTestDetails(test: TestData) {
    this.dialog.open(TestDetailsPopupComponent, {
      width: '750px',
      panelClass: 'sharp-dialog',
      data: { test },
    });
  }

  addParameter() {
    this.testModel.parameters.push({
      name: '',
      unit: '',
      referenceRange: '',
      resultType: 'Numeric',
    });
  }

  removeParameter(index: number) {
    this.testModel.parameters.splice(index, 1);
  }

  deleteTest(test: TestData) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      panelClass: 'sharp-dialog',
      data: {
        type: 'error',
        title: 'Delete Test Record',
        message: `Are you sure you want to remove <b>${test.testName}</b>?`,
        confirmText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loaderService.show();
        this.httpService
          .delete(`/shared/tests/${test.id}`)
          .pipe(
            finalize(() => {
              this.loaderService.hide();
              this.cdr.detectChanges();
            }),
          )
          .subscribe({
            next: (res: any) => {
              if (res.success) {
                this.testList = this.testList.filter((t) => t.id !== test.id);
                this.toastService.show('Test deleted successfully');
              } else {
                this.toastService.show(res.message || 'Failed to delete test');
              }
            },
            error: () => this.toastService.show('Failed to delete test'),
          });
      }
    });
  }

  saveTest() {
    if (!this.formValid()) return;
    this.isSubmitting = true;

    const req = this.editMode
      ? this.httpService.put(`/shared/tests/${this.testModel.id}`, this.testModel)
      : this.httpService.post('/shared/tests', this.testModel);

    req
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.toastService.show(`Test ${this.editMode ? 'updated' : 'added'} successfully`);
            this.testList = [...this.testList, res.data];
            this.closePanel();
          } else {
            this.toastService.show(res.message || 'Error occurred');
          }
        },
        error: () => {
          this.toastService.show('Failed to save test');
        },
      });
  }

  formValid(): boolean {
    return (
      !!this.testModel.testCode &&
      !!this.testModel.testName &&
      !!this.testModel.category &&
      !!this.testModel.sampleType &&
      this.testModel.price >= 0
    );
  }

  hasChanges(): boolean {
    return JSON.stringify(this.testModel) !== JSON.stringify(this.originalModel);
  }

  setFocus(field: string) {
    this.focus[field] = true;
  }
  clearFocus(field: string) {
    this.focus[field] = false;
  }
}
