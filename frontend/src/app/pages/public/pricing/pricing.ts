import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/layout/navbar/navbar';
import { FooterComponent } from '../../../components/layout/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css'
})
export class PricingPage {
  isYearly = false;

  faqs = [
    {
      question: 'Can I upgrade my plan later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. The price difference will be prorated.',
      open: false
    },
    {
      question: 'Do you offer a free trial?',
      answer: 'Yes, we offer a 14-day free trial for all plans. No credit card is required to start.',
      open: false
    },
    {
      question: 'Is my laboratory data secure?',
      answer: 'Absolutely. We use enterprise-grade encryption and follow medical data standards to ensure your data is always protected.',
      open: false
    },
    {
      question: 'Can I manage multiple branches?',
      answer: 'Yes, our Professional and Enterprise plans are specifically designed for multi-branch management.',
      open: false
    },
    {
      question: 'Do patients get online report access?',
      answer: 'Yes, patients can access and download their reports through our secure, branded patient portal.',
      open: false
    }
  ];

  benefits = [
    {
      title: 'Secure cloud platform',
      description: 'Your data is encrypted and stored securely in the cloud with 99.9% uptime.',
      icon: 'shield'
    },
    {
      title: 'Fast report generation',
      description: 'Generate professional reports in seconds with automated reference ranges.',
      icon: 'zap'
    },
    {
      title: 'Easy laboratory workflow',
      description: 'Streamline your daily tasks from patient registration to final reporting.',
      icon: 'activity'
    },
    {
      title: 'Multi-branch management',
      description: 'Centralized control for all your branch locations from a single dashboard.',
      icon: 'grid'
    }
  ];

  toggleBilling() {
    this.isYearly = !this.isYearly;
  }

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
