import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../components/layout/navbar/navbar';
import { FooterComponent } from '../../../components/layout/footer/footer';
import { HttpService } from '../../../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    MatIconModule
  ],


  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm!: FormGroup;
  isSubmitted = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private httpService: HttpService, private router: Router, private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.httpService.post('/auth/forgot-password', this.forgotPasswordForm.value).subscribe({
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
          this.snack.open('Failed to send', 'OK', { duration: 3000 });
        }
      })
      this.isSubmitted = true;
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.forgotPasswordForm.reset();
  }
}
