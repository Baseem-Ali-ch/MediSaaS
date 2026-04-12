import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { ReportTemplateComponent } from '../../../components/report-template/report-template.component';
import { LoaderService } from '../../../services/loader.service';
import { ReportDataService } from '../../../services/report-data.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-report-print',
  standalone: true,
  imports: [CommonModule, ReportTemplateComponent],
  template: `
    <div class="print-page">
      <div *ngIf="loading" class="no-print loading-state">
        <p>Loading report...</p>
      </div>

      <div *ngIf="!loading && report" class="report-content" #printSection>
        <app-report-template [data]="report"></app-report-template>
      </div>

      <div *ngIf="!loading && !report" class="no-print error-state">
        <p>Report not found.</p>
      </div>

      <div class="no-print print-actions" *ngIf="report && !loading">
        <button (click)="print()" class="print-fab">Print Report</button>
      </div>
    </div>
  `,
  styles: [
    `
      .print-page {
        background: white;
        min-height: 100vh;
        padding: 0;
      }
      .loading-state,
      .error-state {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-size: 1.2rem;
        color: #666;
      }
      .print-actions {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 1000;
      }
      .print-fab {
        background: #1a7a3c;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 30px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(26, 122, 60, 0.3);
        transition: all 0.2s;
      }
      .print-fab:hover {
        transform: translateY(-2px);
        background: #136130;
        box-shadow: 0 6px 16px rgba(26, 122, 60, 0.4);
      }
      @media print {
        .no-print {
          display: none !important;
        }
        .print-page {
          padding: 0;
          margin: 0;
        }
      }
    `,
  ],
})
export class ReportPrintComponent implements OnInit {
  reportId: string | null = null;
  report: any = null;
  loading = true;

  @ViewChild('printSection') printSection!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private reportDataService: ReportDataService,
  ) {}

  ngOnInit(): void {
    const dataFromService = this.reportDataService.getReportData();
    if (dataFromService) {
      this.report = dataFromService;
      this.loading = false;
    } else {
      this.reportId = this.route.snapshot.paramMap.get('id');
      if (this.reportId && this.reportId !== 'preview') {
        this.fetchReport(this.reportId);
      } else {
        this.loading = false;
      }
    }
  }

  fetchReport(id: string): void {
    this.loading = true;
    this.httpService
      .get(`/shared/reports/${id}`)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.report = res.data;
        },
        error: () => {
          console.error('Failed to fetch report');
        },
      });
  }

  print(): void {
    window.print();
  }
}
