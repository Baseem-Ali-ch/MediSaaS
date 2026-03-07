import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../components/layout/navbar/navbar';
import { FooterComponent } from '../../../components/layout/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
