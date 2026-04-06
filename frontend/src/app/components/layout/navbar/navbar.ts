import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit {
  @Input() isAdmin: boolean = false;

  isDarkMode: boolean = false;

  constructor(
    private router: Router,
    private tokenService: TokenService,
  ) {}

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
    if (value === 'profile' || value === 'settings') {
      this.router.navigate(['/admin/profile']);
    }
  }

  logout() {
    this.tokenService.clearTokens();
    localStorage.removeItem('role');
    this.router.navigate(['/auth/login']);
  }
}
