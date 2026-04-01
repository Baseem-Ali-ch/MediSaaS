import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="toast-container" [class.show]="toast().show">
      <div class="toast-content">
        <mat-icon class="toast-icon">task_alt</mat-icon>
        <span class="toast-message">{{ toast().message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      z-index: 200000;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      pointer-events: none;
    }

    .toast-container.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    .toast-content {
      background: #0d2b17;
      color: white;
      padding: 12px 24px;
      border-radius: 50px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 15px 35px rgba(13, 43, 23, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      white-space: nowrap;
    }

    .toast-icon {
      color: #4ade80;
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .toast-message {
      font-weight: 500;
      font-size: 0.95rem;
      letter-spacing: 0.2px;
    }

    @media (max-width: 600px) {
      .toast-container {
        bottom: 20px;
        width: 100%;
        padding: 0 20px;
      }
      .toast-content {
        justify-content: center;
        width: 100%;
      }
    }
  `]
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toast = this.toastService.toast;
}
