import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../components/layout/navbar/navbar';
import { FooterComponent } from '../../../components/layout/footer/footer';
import { HttpService } from '../../../services/http.service';
import { LoaderService } from '../../../services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenService } from '../../../services/token.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],

  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailPage implements OnInit {
  email = 'user@example.com'; // This would usually come from a service or state
  countdown = 60;
  canResend = false;
  timer: any;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    private router: Router,
    private snack: MatSnackBar,
    private ngZone: NgZone,
    private tokenService: TokenService,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.startCountdown();

    this.route.queryParams.subscribe((params) => {
      const token = params['token'];

      if (token) {
        this.verifyEmail(token);
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
    this.loaderService.show();
    this.httpService
      .get('/auth/verify-email', { token })
      .pipe(
        finalize(() => {
          this.loaderService.hide();
        }),
      )
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.tokenService.setTokens(res.token.accessToken, res.token.refreshToken);
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.snack.open(res.message, 'OK', { duration: 3000 });
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
