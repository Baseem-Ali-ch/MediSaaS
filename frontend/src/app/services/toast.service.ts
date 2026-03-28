import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSignal = signal<{ message: string; show: boolean }>({ message: '', show: false });

  toast = this.toastSignal.asReadonly();

  show(message: string, duration: number = 3000) {
    this.toastSignal.set({ message, show: true });
    setTimeout(() => {
      this.toastSignal.set({ message: '', show: false });
    }, duration);
  }
}
