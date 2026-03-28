import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../components/layout/navbar/navbar';
import { FooterComponent } from '../../../components/layout/footer/footer';
import { HttpService } from '../../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenService } from '../../../services/token.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    MatIconModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private httpService: HttpService, private snack: MatSnackBar, private router: Router, private tokenService: TokenService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true
      this.httpService.post('/auth/login', this.loginForm.value).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            this.tokenService.setTokens(res.token.accessToken, res.token.refreshToken);
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.snack.open(res.message, 'OK', { duration: 3000 });
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
          this.snack.open('Failed to login', 'OK', { duration: 3000 });
        }
      })
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
