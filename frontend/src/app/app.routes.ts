import { Routes } from '@angular/router';
import { Home } from './pages/public/home/home';
import { AboutPage } from './pages/public/about/about';
import { ContactPage } from './pages/public/contact/contact';
import { PricingPage } from './pages/public/pricing/pricing';
import { RegisterPage } from './pages/auth/register/register';
import { LoginPage } from './pages/auth/login/login';
import { ForgotPasswordPage } from './pages/auth/forgot-password/forgot-password';
import { VerifyEmailPage } from './pages/auth/verify-email/verify-email';
import { ResetPasswordPage } from './pages/auth/reset-password/reset-password';
import { AdminLayoutComponent } from './pages/admin-portal/layout/admin-layout.component';
import { DashboardComponent } from './pages/admin-portal/dashboard/dashboard.component';
import { authGuard } from './guards/auth-guard';
import { roleGuard, roleMatchGuard } from './guards/role-guard';
import { authRedirectGuard } from './guards/auth-redirect-guard';
import { NotFoundPage } from './pages/public/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'about', component: AboutPage },
  { path: 'contact', component: ContactPage },
  { path: 'pricing', component: PricingPage },

  {
    path: 'auth',
    canActivate: [authRedirectGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginPage },
      { path: 'register-lab', component: RegisterPage },
      { path: 'forgot-password', component: ForgotPasswordPage },
      { path: 'verify-email', component: VerifyEmailPage },
      { path: 'reset-password', component: ResetPasswordPage },
    ],
  },

  {
    path: ':role',
    component: AdminLayoutComponent,
    //canMatch: [roleMatchGuard],
    //canActivate: [authGuard, roleGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/admin-portal/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'lab-management',
        loadComponent: () =>
          import('./pages/admin-portal/configuration/lab/lab-management.component').then(
            (m) => m.LabManagementComponent,
          ),
      },
      {
        path: 'branch-management',
        loadComponent: () =>
          import('./pages/admin-portal/configuration/branches/branches.component').then(
            (m) => m.BranchesComponent,
          ),
      },
      {
        path: 'staff-management',
        loadComponent: () =>
          import('./pages/admin-portal/configuration/staff/staff-management.component').then(
            (m) => m.StaffManagementComponent,
          ),
      },
      {
        path: 'patients',
        loadComponent: () =>
          import('./pages/admin-portal/configuration/patients/patients.component').then(
            (m) => m.PatientsComponent,
          ),
      },
      {
        path: 'test-management',
        loadComponent: () =>
          import('./pages/admin-portal/configuration/tests/tests-management.component').then(
            (m) => m.TestsManagementComponent,
          ),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./pages/admin-portal/bookings/bookings.component').then(
            (m) => m.BookingsComponent,
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/admin-portal/reports/reports.component').then((m) => m.ReportsComponent),
      },
      {
        path: 'print-report/:id',
        loadComponent: () =>
          import('./pages/admin-portal/reports/report-print.component').then(
            (m) => m.ReportPrintComponent,
          ),
      },
      { path: '**', redirectTo: '/404' },
    ],
  },

  { path: '404', component: NotFoundPage },
  { path: '**', redirectTo: '404' },
];
