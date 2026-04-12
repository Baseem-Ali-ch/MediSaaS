import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportDataService } from '../../../services/report-data.service';
import { ReportTemplateComponent } from '../../../components/report-template/report-template.component';

@Component({
  selector: 'app-report-preview-popup',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, ReportTemplateComponent],
  template: `
    <div class="popup-container modern-card preview-modal-container">
      <div class="popup-header p-20 flex-between">
        <div class="flex gap-16 align-center">
          <div class="avatar-container">
            <div class="avatar-placeholder">
              <mat-icon>visibility</mat-icon>
            </div>
          </div>
          <div class="header-info">
            <div class="flex align-center gap-8">
              <h2 class="test-title">Report Preview</h2>
              <span class="status-badge completed"
                >Review the report before finalising or printing</span
              >
            </div>
          </div>
        </div>
        <div class="flex gap-8">
          <button mat-icon-button color="primary" (click)="print()">
            <mat-icon>print</mat-icon>
          </button>
          <button mat-icon-button (click)="close()" class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <div class="preview-content">
        <app-report-template [data]="report"></app-report-template>
      </div>
    </div>
  `,
  styleUrls: ['../../../../assets/styles/popup.css'],
  styles: [
    `
      .preview-modal-container {
        height: 90vh;
        max-height: 1000px;
        width: 100%;
        max-width: 1000px;
      }
      .preview-content {
        flex: 1;
        overflow-y: auto;
        padding: 40px 20px;
        background: #f0f4f2;
        display: flex;
        justify-content: center;
      }
      app-report-template {
        display: block;
        width: 100%;
        max-width: 850px;
      }
      @media print {
        body * {
          visibility: hidden !important;
        }
        .popup-container.preview-modal-container,
        .popup-container.preview-modal-container * {
          visibility: visible !important;
        }
        .popup-container.preview-modal-container {
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          background: white !important;
          z-index: 9999 !important;
        }
        .popup-header,
        .popup-footer,
        .avatar-placeholder,
        .close-btn {
          display: none !important;
        }
        .preview-content {
          padding: 0 !important;
          margin: 0 !important;
          overflow: visible !important;
          background: white !important;
        }
        app-report-template {
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      }
    `,
  ],
})
export class ReportPreviewPopupComponent {
  report: any;

  constructor(
    public dialogRef: MatDialogRef<ReportPreviewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private route: ActivatedRoute,
    private reportDataService: ReportDataService,
  ) {
    this.report = data.report;
    if (data.printOnOpen) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  print(): void {
    window.print();
  }
}
