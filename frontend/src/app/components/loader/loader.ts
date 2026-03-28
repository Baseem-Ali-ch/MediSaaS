import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    @if (isLoading || loaderService.loading()) {
      <div class="loader-overlay h-full w-full">
         <div class="loader-container">
           <div class="spinner-wrapper">
             <mat-spinner [diameter]="diameter" strokeWidth="4"></mat-spinner>
             <div class="spinner-dot"></div>
           </div>
         </div>
      </div>
    }
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100000;
      pointer-events: all; /* Block interactions */
    }

    .loader-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    :host ::ng-deep .mat-mdc-progress-spinner {
      --mdc-circular-progress-active-indicator-color: #0d2b17 !important;
    }
    
    .spinner-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner-dot {
      position: absolute;
      width: 10px;
      height: 10px;
      background-color: #0d2b17;
      border-radius: 50%;
      box-shadow: 0 0 15px rgba(13, 43, 23, 0.6);
      animation: pulse 1.2s infinite ease-in-out;
    }

    @keyframes pulse {
      0% { transform: scale(0.8); opacity: 0.5; }
      50% { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(0.8); opacity: 0.5; }
    }
  `]
})
export class LoaderComponent {
  loaderService = inject(LoaderService);
  @Input() isLoading = false;
  @Input() diameter = 55;
}

