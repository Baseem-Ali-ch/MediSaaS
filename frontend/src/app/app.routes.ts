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

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'home', component: Home },
    { path: 'about', component: AboutPage },
    { path: 'contact', component: ContactPage },
    { path: 'pricing', component: PricingPage },

    {
        path: 'auth',
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginPage },
            { path: 'register-lab', component: RegisterPage },
            { path: 'forgot-password', component: ForgotPasswordPage },
            { path: 'verify-email', component: VerifyEmailPage },
            { path: 'reset-password', component: ResetPasswordPage }
        ]
    },

    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'profile', loadComponent: () => import('./pages/admin-portal/profile/profile.component').then(m => m.ProfileComponent) },
            { path: 'lab-management', loadComponent: () => import('./pages/admin-portal/configuration/lab-management/lab-management.component').then(m => m.LabManagementComponent) },
            { path: 'branch-management', loadComponent: () => import('./pages/admin-portal/configuration/branches/branches.component').then(m => m.BranchesComponent) }
        ]
    }
];
