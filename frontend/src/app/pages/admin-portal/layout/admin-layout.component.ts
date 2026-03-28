import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/layout/sidebar/sidebar';
import { NavbarComponent } from '../../../components/layout/navbar/navbar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, NavbarComponent],
  template: `
    <div class="admin-wrapper">
      
      <!-- Reusable Sidebar -->
      <app-sidebar></app-sidebar>

      <!-- Main Content Container -->
      <div class="admin-main">
        
        <!-- Reusable Navbar (Admin Mode) -->
        <app-navbar [isAdmin]="true"></app-navbar>

        <!-- Page Content -->
        <main class="admin-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-wrapper {
      display: flex;
      height: 100vh;
      background-color: var(--bg-main);
      color: var(--text-primary);
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    }

    .admin-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .admin-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
      background-color: var(--bg-main);
    }

    @media (max-width: 640px) {
      .admin-content {
        padding: 20px;
      }
    }
  `]
})
export class AdminLayoutComponent {
  // Logic is now delegated to Sidebar Component and Navbar Component
}
