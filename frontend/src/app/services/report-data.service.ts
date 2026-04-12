import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {
  private reportData = new BehaviorSubject<any>(null);
  currentReport$ = this.reportData.asObservable();

  setReportData(data: any) {
    this.reportData.next(data);
  }

  getReportData() {
    return this.reportData.getValue();
  }
}
