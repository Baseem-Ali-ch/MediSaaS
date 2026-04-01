import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="pagination-container flex-between p-16">
      <div class="pagination-info text-muted">
        Showing <b>{{ startRange }}</b> - <b>{{ endRange }}</b> of <b>{{ totalItems }}</b> total
      </div>

      <div class="pagination-controls flex gap-8">
        <button
          mat-icon-button
          [disabled]="currentPage === 1"
          (click)="goToPage(1)"
          class="page-btn"
          title="First Page"
        >
          <mat-icon>first_page</mat-icon>
        </button>

        <button
          mat-icon-button
          [disabled]="currentPage === 1"
          (click)="goToPage(currentPage - 1)"
          class="page-btn"
          title="Previous"
        >
          <mat-icon>chevron_left</mat-icon>
        </button>

        <div class="page-numbers flex gap-4">
          @for (page of visiblePages; track page) {
            <button
              class="page-num-btn"
              [class.active]="page === currentPage"
              (click)="goToPage(page)"
            >
              {{ page }}
            </button>
          }
        </div>

        <button
          mat-icon-button
          [disabled]="currentPage === totalPages"
          (click)="goToPage(currentPage + 1)"
          class="page-btn"
          title="Next"
        >
          <mat-icon>chevron_right</mat-icon>
        </button>

        <button
          mat-icon-button
          [disabled]="currentPage === totalPages"
          (click)="goToPage(totalPages)"
          class="page-btn"
          title="Last Page"
        >
          <mat-icon>last_page</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .pagination-container {
        border-top: 1px solid var(--border);
        background: var(--bg-card);
        border-radius: 0 0 var(--radius-card) var(--radius-card);
        margin-top: -1px;
      }
      .page-num-btn {
        min-width: 24px;
        height: 24px;
        border-radius: var(--radius-button);
        border: 1px solid transparent;
        background: transparent;
        color: var(--text-primary);
        font-weight: 500;
        font-size: 12px;
        cursor: pointer;
        transition: var(--transition-fast);
      }
      .page-num-btn:hover {
        background: var(--bg-main);
        color: var(--primary);
      }
      .page-num-btn.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
        font-size: 0.8rem;
      }
      .text-muted {
        font-size: 0.9rem;
        color: var(--text-secondary);
      }
      .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .flex {
        display: flex;
        align-items: center;
      }
      .gap-8 {
        gap: 8px;
      }
      .gap-4 {
        gap: 4px;
      }
      .p-16 {
        padding: 12px 24px;
      }

      ::ng-deep .page-btn {
        color: var(--text-secondary) !important;
        width: 32px !important;
        height: 32px !important;
        line-height: 32px !important;
      }
      ::ng-deep .page-btn mat-icon {
        font-size: 18px !important;
        width: 18px !important;
      }
      ::ng-deep .page-btn:disabled {
        opacity: 0.4 !important;
      }
    `,
  ],
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  totalPages: number = 1;
  visiblePages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    this.updateVisiblePages();
  }

  updateVisiblePages() {
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    this.visiblePages = [];
    for (let i = start; i <= end; i++) {
      this.visiblePages.push(i);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  get startRange(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRange(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }
}
