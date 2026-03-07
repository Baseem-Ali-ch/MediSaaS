import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/layout/navbar/navbar';
import { FooterComponent } from '../../../components/layout/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactPage {
  faqs = [
    {
      question: 'How do I start a free trial?',
      answer: 'You can start a 14-day free trial by clicking the "Start Free Trial" button in the navigation bar. No credit card is required to begin.',
      open: false
    },
    {
      question: 'Can I manage multiple laboratory branches?',
      answer: 'Yes, our Professional and Enterprise plans allow you to manage multiple branches from a single centralized dashboard.',
      open: false
    },
    {
      question: 'Is patient data secure?',
      answer: 'Absolutely. We use enterprise-grade encryption and follow medical data standards to ensure all patient information is stored securely.',
      open: false
    },
    {
      question: 'Can patients download reports online?',
      answer: 'Yes, patients can access their reports through our secure Patient Portal using their unique credentials or via a secure link sent to them.',
      open: false
    }
  ];

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
