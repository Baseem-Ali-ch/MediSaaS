import { Component, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface SidebarItem {
  label: string;
  route?: string;
  icon: string;
  children?: { label: string; route: string; }[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit {
  isCollapsed = signal(false);
  isDarkMode = false;

  navItems: SidebarItem[] = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Patients', route: '/admin/patients', icon: 'masks' },
    {
      label: 'Diagnostics',
      icon: 'science',
      expanded: false,
      children: [
        { label: 'Test Catalogue', route: '/admin/tests' },
        { label: 'Test Orders', route: '/admin/orders' },
        { label: 'Equipment', route: '/admin/equipment' }
      ]
    },
    { label: 'Reports', route: '/admin/reports', icon: 'description' },
    {
      label: 'Administration',
      icon: 'admin_panel_settings',
      expanded: false,
      children: [
        { label: 'Staff Management', route: '/admin/staff' },
        { label: 'Billing', route: '/admin/billing' }
      ]
    },
    { label: 'Settings', route: '/admin/profile', icon: 'settings' },
    {
      label: 'Configuration',
      icon: 'tune',
      expanded: false,
      children: [
        { label: 'Lab Management', route: '/admin/lab-management' },
        { label: 'Branch Management', route: '/admin/branch-management' },
      ]
    },
  ];

  ngOnInit() {
    this.isDarkMode = document.documentElement.classList.contains('dark');
  }

  toggleSidebar() {
    this.isCollapsed.update(val => !val);

    // Auto collapse parent menus when collapsing sidebar
    if (this.isCollapsed()) {
      this.navItems.forEach(item => {
        if (item.children) {
          item.expanded = false;
        }
      });
    }
  }

  toggleExpand(item: SidebarItem) {
    if (this.isCollapsed()) {
      this.isCollapsed.set(false); // Expand sidebar first if user clicks a menu category
    }
    item.expanded = !item.expanded;
  }

  getTooltipContent(item: SidebarItem): string {
    return item.label;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
