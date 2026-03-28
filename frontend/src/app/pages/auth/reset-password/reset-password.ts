import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../components/layout/navbar/navbar';
import { FooterComponent } from '../../../components/layout/footer/footer';
import { HttpService } from '../../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    MatIconModule
  ],


  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPasswordPage implements OnInit {
  resetForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isSubmitted = false;
  token: string | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute, private httpService: HttpService, private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.initForm();
  }

  initForm(): void {
    this.resetForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordPatternValidator
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordPatternValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasNumber && hasSpecial;
    return !valid ? { passwordPattern: true } : null;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.isLoading = true
    if (this.resetForm.valid) {
      this.httpService.post(`/auth/reset-password?token=${this.token}`, this.resetForm.value).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            this.snack.open(res.message, 'OK', { duration: 3000 });
          } else {
            this.snack.open(res.message, 'OK', { duration: 3000 });
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
          this.snack.open('Failed to reset password', 'OK', { duration: 3000 });
        }
      })
      // Simulate API call
      this.isSubmitted = true;
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
}
