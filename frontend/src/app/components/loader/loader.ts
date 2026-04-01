import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
  template: `
    @if (isLoading || loaderService.loading()) {
      <div class="loader-overlay h-full w-full">
         <div class="loader-container">
            <div class="medical-loader">
              <div class="circle outer"></div>
              <div class="circle middle"></div>
              <div class="circle inner">
                <mat-icon>medical_services</mat-icon>
              </div>
            </div>
            <p class="loader-text">Processing...</p>
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
      background: rgba(var(--bg-main-rgb, 242, 250, 244), 0.7);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100000;
      pointer-events: all;
    }

    .loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .medical-loader {
      position: relative;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .circle {
      position: absolute;
      border-radius: 50%;
      border: 2px solid transparent;
      animation: spin var(--duration) linear infinite;
    }

    .circle.outer {
      width: 100%;
      height: 100%;
      border-top-color: var(--primary);
      border-bottom-color: var(--primary);
      --duration: 2s;
    }

    .circle.middle {
      width: 70%;
      height: 70%;
      border-left-color: var(--accent);
      border-right-color: var(--accent);
      --duration: 1.5s;
      animation-direction: reverse;
    }

    .circle.inner {
      width: 40%;
      height: 40%;
      background: var(--primary);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(26, 122, 60, 0.4);
      animation: pulse 1.5s ease-in-out infinite;
    }

    .circle.inner mat-icon {
      color: white;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .loader-text {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.9rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin: 0;
      animation: fadeInOut 1.5s ease-in-out infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.15); opacity: 0.8; box-shadow: 0 0 30px rgba(26, 122, 60, 0.6); }
    }

    @keyframes fadeInOut {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
  `]
})
export class LoaderComponent {
  loaderService = inject(LoaderService);
  @Input() isLoading = false;
  @Input() diameter = 55;
}
