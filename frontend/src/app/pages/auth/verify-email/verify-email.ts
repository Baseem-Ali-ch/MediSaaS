import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../components/layout/navbar/navbar';
import { FooterComponent } from '../../../components/layout/footer/footer';
import { HttpService } from '../../../services/http.service';
import { LoaderComponent } from '../../../components/loader/loader';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    FooterComponent, LoaderComponent
  ],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css'
})
export class VerifyEmailPage implements OnInit {
  email = 'user@example.com'; // This would usually come from a service or state
  countdown = 60;
  canResend = false;
  timer: any;
  isLoading = false;

  constructor(private route: ActivatedRoute, private httpService: HttpService, private router: Router, private snack: MatSnackBar, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.startCountdown();

    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (token) {
        this.verifyEmail(token)
      }
    });
  }


  startCountdown(): void {
    this.ngZone.run(() => {
      this.timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.canResend = true;
          clearInterval(this.timer);
        }
      }, 1000);
    });
  }

  onResend(): void {
    if (this.canResend) {
      console.log('Resending verification email...');
      // Simulate API call
      this.startCountdown();
    }
  }

  verifyEmail(token: string) {
    this.isLoading = true
    this.httpService.get('/auth/verify-email', { token }).subscribe({
      next: (res: any) => {
        this.isLoading = false
        if (res.success) {
          localStorage.setItem('access-token', res.token.accessToken)
          localStorage.setItem('access-token', res.token.accessToken)

          this.router.navigate(['/admin/dashboard'])
        } else {
          this.snack.open(res.message, 'OK', { duration: 3000 });
        }
      },
      error: (err) => {
        this.isLoading = false
        console.log(err)
      }
    })
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
