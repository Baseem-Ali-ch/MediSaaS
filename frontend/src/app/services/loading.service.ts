import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private pageLoadingCount = signal<number>(0);
  private buttonLoadingStates = signal<Record<string, number>>({});

  /**
   * Computed signal reflecting whether the page loader should be displayed.
   */
  readonly isPageLoading = computed(() => this.pageLoadingCount() > 0);

  /**
   * Check if a specific loader type/id is currently loading.
   */
  isLoading(type: 'page'): boolean;
  isLoading(type: 'button', id: string): boolean;
  isLoading(type: 'page' | 'button', id?: string): boolean {
    if (type === 'page') {
      return this.pageLoadingCount() > 0;
    }
    if (type === 'button' && id) {
      return (this.buttonLoadingStates()[id] || 0) > 0;
    }
    return false;
  }

  /**
   * Show a loader.
   * If type is 'button', an ID must be provided.
   */
  show(type: 'page'): void;
  show(type: 'button', id: string): void;
  show(type: 'page' | 'button', id?: string): void {
    if (type === 'page') {
      this.pageLoadingCount.update(c => c + 1);
    } else if (type === 'button' && id) {
      this.buttonLoadingStates.update(s => ({ ...s, [id]: (s[id] || 0) + 1 }));
    }
  }

  /**
   * Hide a loader.
   * If type is 'button', an ID must be provided.
   */
  hide(type: 'page'): void;
  hide(type: 'button', id: string): void;
  hide(type: 'page' | 'button', id?: string): void {
    if (type === 'page') {
      this.pageLoadingCount.update(c => Math.max(0, c - 1));
    } else if (type === 'button' && id) {
      this.buttonLoadingStates.update(s => ({ ...s, [id]: Math.max(0, (s[id] || 0) - 1) }));
    }
  }
}
