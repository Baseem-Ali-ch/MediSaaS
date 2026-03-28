import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, MatSelectModule, MatIconModule, MatBadgeModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  
  isDarkMode: boolean = false;
  selectedProfileOption: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.isDarkMode = document.documentElement.classList.contains('dark');
    if (!this.isDarkMode) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.isDarkMode = true;
        document.documentElement.classList.add('dark');
      }
    }
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

  onProfileOptionChange(value: string) {
    if (value === 'profile') {
      this.router.navigate(['/admin/profile']);
    } else if (value === 'settings') {
      this.router.navigate(['/admin/profile']);
    } else if (value === 'logout') {
      // Logout
    }
    // reset selection so it acts like a menu
    setTimeout(() => this.selectedProfileOption = '', 100);
  }
}
