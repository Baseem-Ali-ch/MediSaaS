import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../components/layout/navbar/navbar';
import { FooterComponent } from '../../../components/layout/footer/footer';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpService } from '../../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    MatSelectModule,
    MatFormFieldModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;

  timezones = [
    '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
    '(UTC+00:00) London, Dublin, Edinburgh',
    '(UTC-05:00) Eastern Time (US & Canada)',
    '(UTC+09:00) Osaka, Sapporo, Tokyo'
  ];

  currencies = ['INR', 'USD', 'EUR', 'GBP'];

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      // Section 1: Lab Details
      labName: ['', [Validators.required]],
      labType: [''],
      registrationNumber: [''],
      labEmail: ['', [Validators.required, Validators.email]],
      labPhone: ['', [Validators.required]],

      // Section 2: Address Information
      address1: ['', [Validators.required]],
      address2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],

      // Section 3: Owner Details
      ownerName: ['', [Validators.required]],
      ownerEmail: ['', [Validators.required, Validators.email]],
      ownerPhone: ['', [Validators.required]],

      // Section 4: Account Security
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordPatternValidator
      ]],
      confirmPassword: ['', [Validators.required]],

      // Section 6: Terms
      agreeTerms: [false, [Validators.requiredTrue]]
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

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.httpService.post('/auth/register-lab', this.registerForm.value).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            this.router.navigate(['/auth/verify-email']);
          } else {
            this.snack.open(res.message, 'OK', { duration: 3000 });
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
          this.snack.open('Failed to register', 'OK', { duration: 3000 });
        }
      })
    } else {
      this.markFormGroupTouched(this.registerForm);
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
