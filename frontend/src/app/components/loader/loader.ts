import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <!-- Page Loader -->
    @if (isLoading && type === 'page') {
      <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
         <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center">
           <mat-spinner diameter="40"></mat-spinner>
           <span class="mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">Loading...</span>
         </div>
      </div>
    }

    <!-- Button Loader -->
    @if (isLoading && type === 'button') {
      <div class="inline-flex items-center justify-center">
        <mat-spinner [diameter]="diameter"></mat-spinner>
      </div>
    }
  `
})
export class LoaderComponent {
  @Input() type: 'page' | 'button' = 'button';
  @Input() isLoading = false;
  @Input() diameter = 24;
}
