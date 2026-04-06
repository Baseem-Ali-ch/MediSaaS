import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface SidebarItem {
  label: string;
  route?: string;
  icon: string;
  children?: { label: string; route: string; roles?: string[] }[];
  expanded?: boolean;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent implements OnInit {
  private route = inject(ActivatedRoute);

  isCollapsed = signal(false);
  isDarkMode = false;
  role: string = '';
  navItems: SidebarItem[] = [];

  ngOnInit() {
    this.isDarkMode = document.documentElement.classList.contains('dark');

    this.role = localStorage.getItem('role') ?? 'admin';
    this.navItems = this.buildNavItems(this.role);
  }

  buildNavItems(role: string): SidebarItem[] {
    const p = `/${role}`;

    const allItems: SidebarItem[] = [
      {
        label: 'Dashboard',
        route: `${p}/dashboard`,
        icon: 'dashboard',
        roles: ['admin', 'owner', 'staff'],
      },
      {
        label: 'Patients',
        route: `${p}/patients`,
        icon: 'masks',
        roles: ['admin', 'owner', 'staff'],
      },
      {
        label: 'Diagnostics',
        icon: 'science',
        expanded: false,
        roles: ['admin', 'owner', 'staff'],
        children: [
          { label: 'Test Catalogue', route: `${p}/tests` },
          { label: 'Test Orders', route: `${p}/orders` },
          { label: 'Equipment', route: `${p}/equipment` },
        ],
      },
      {
        label: 'Reports',
        route: `${p}/reports`,
        icon: 'description',
        roles: ['admin', 'owner', 'staff'],
      },
      {
        label: 'Administration',
        icon: 'admin_panel_settings',
        expanded: false,
        roles: ['admin', 'owner'],
        children: [
          { label: 'Staff Management', route: `${p}/staff` },
          { label: 'Billing', route: `${p}/billing` },
        ],
      },
      {
        label: 'Settings',
        route: `${p}/profile`,
        icon: 'settings',
        roles: ['admin', 'owner', 'staff'],
      },
      {
        label: 'Configuration',
        icon: 'tune',
        expanded: false,
        roles: ['admin', 'owner'],
        children: [
          {
            label: 'Lab Management',
            route: `${p}/lab-management`,
            roles: ['admin', 'owner'],
          },
          { label: 'Branch Management', route: `${p}/branch-management` },
          { label: 'Staff Management', route: `${p}/staff-management` },
        ],
      },
    ];

    return allItems
      .filter((item) => item.roles?.includes(role))
      .map((item) => {
        if (item.children) {
          return {
            ...item,
            children: item.children.filter(
              (child: any) => !child.roles || child.roles.includes(role),
            ),
          };
        }
        return item;
      });
  }

  toggleSidebar() {
    this.isCollapsed.update((val) => !val);

    if (this.isCollapsed()) {
      this.navItems.forEach((item) => {
        if (item.children) {
          item.expanded = false;
        }
      });
    }
  }

  toggleExpand(item: SidebarItem) {
    if (this.isCollapsed()) {
      this.isCollapsed.set(false);
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
