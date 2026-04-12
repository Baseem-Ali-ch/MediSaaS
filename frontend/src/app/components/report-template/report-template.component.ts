import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-report-template',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDividerModule],
  templateUrl: './report-template.component.html',
  styleUrls: ['./report-template.component.css']
})
export class ReportTemplateComponent implements OnInit {
  @Input() data: any;

  constructor() {}

  ngOnInit(): void {
    if (this.data && this.data.testResults) {
      this.data.testResults.forEach((res: any) => {
        if (res.test && res.test.resultType === 'Multi Parameter' && typeof res.test.parameters === 'string') {
          try {
            // some parameters might be double/triple stringified as per user request
            let parsedParams = JSON.parse(res.test.parameters);
            if (typeof parsedParams === 'string') {
              parsedParams = JSON.parse(parsedParams);
            }
            if (typeof parsedParams === 'string') {
              parsedParams = JSON.parse(parsedParams);
            }
            res.test.parsedParameters = parsedParams;

            // Also parse the result if it's a map keyed by parameter name
            if (typeof res.result === 'string' && (res.result.startsWith('{') || res.result.startsWith('['))) {
              res.parsedResult = JSON.parse(res.result);
            } else {
              res.parsedResult = res.result;
            }
          } catch (e) {
            console.error('Error parsing parameters', e);
          }
        }
      });
    }
  }

  getParamResult(res: any, paramName: string): string {
    if (res.parsedResult && typeof res.parsedResult === 'object') {
      return res.parsedResult[paramName] || '-';
    }
    return '-';
  }
}
