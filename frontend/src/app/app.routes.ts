import { Routes } from '@angular/router';
import { Home } from './pages/public/home/home';
import { AboutPage } from './pages/public/about/about';
import { ContactPage } from './pages/public/contact/contact';
import { PricingPage } from './pages/public/pricing/pricing';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'home', component: Home },
    { path: 'about', component: AboutPage },
    { path: 'contact', component: ContactPage },
    { path: 'pricing', component: PricingPage }
];
