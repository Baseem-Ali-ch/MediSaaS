import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../components/layout/navbar/navbar';
import { FooterComponent } from '../../../components/layout/footer/footer';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutPage {}
