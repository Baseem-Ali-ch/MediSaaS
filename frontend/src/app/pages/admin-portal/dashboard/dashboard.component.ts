import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './dashboard.css',
  template: `
    <div class="dashboard-wrapper">
      
      <!-- Header -->
      <div class="dash-header">
        <div class="dash-title-wrapper">
          <h1 class="dash-title">Dashboard Overview</h1>
          <p class="dash-subtitle">Welcome back, here's what's happening at your lab today.</p>
        </div>
        <div class="dash-header-actions">
          <button class="btn btn-secondary dash-btn-export">Export Report</button>
          <button class="btn btn-primary dash-btn-new">
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            New Order
          </button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-grid">
        @for (action of quickActions; track action.title) {
          <button class="action-card">
            <div class="action-icon-box" [classList]="'action-icon-box ' + action.typeClass">
               <span [innerHTML]="action.icon"></span>
            </div>
            <div class="action-info">
              <p class="action-title">{{ action.title }}</p>
              <p class="action-subtitle">{{ action.subtitle }}</p>
            </div>
          </button>
        }
      </div>

      <!-- Summary Cards -->
      <div class="summary-grid">
        @for (stat of stats; track stat.title) {
          <div class="summary-card">
            <div class="summary-blob" [classList]="'summary-blob ' + stat.typeClass"></div>
            
            <div class="summary-header">
              <div class="summary-text-group">
                <p class="summary-label">{{ stat.title }}</p>
                <h3 class="summary-value">{{ stat.value }}</h3>
              </div>
              <div class="summary-icon-box" [classList]="'summary-icon-box ' + stat.typeClass">
                <span [innerHTML]="stat.icon"></span>
              </div>
            </div>
            
            <div class="summary-trend">
              <span class="trend-indicator" [classList]="'trend-indicator ' + stat.trend">
                @if (stat.trend === 'up') {
                  <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                } @else {
                  <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
                }
                {{ stat.trendValue }}
              </span>
              <span class="trend-context">vs yesterday</span>
            </div>
          </div>
        }
      </div>

      <!-- Charts & Alerts Row -->
      <div class="charts-alerts-grid">
        <!-- Main Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <div>
              <h2 class="card-title">Revenue Analytics</h2>
              <p class="card-subtitle">Daily revenue across all test departments</p>
            </div>
            <select class="chart-select">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          
          <!-- Mock Chart Container -->
          <div class="chart-container">
            <!-- Grid lines -->
            <div class="chart-grid-lines">
              <div class="grid-line"></div>
              <div class="grid-line"></div>
              <div class="grid-line"></div>
              <div class="grid-line"></div>
              <div class="grid-line base"></div>
            </div>
            
            <!-- Bars -->
            @for (bar of [40, 65, 30, 80, 55, 90, 70]; track $index) {
              <div class="chart-bar-group">
                <!-- Tooltip -->
                <div class="chart-tooltip">$\{{ bar * 12 }}</div>
                <div class="chart-bar-bg" [style.height.%]="bar">
                  <div class="chart-bar-fill"></div>
                </div>
                <div class="chart-bar-label">
                  {{ ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][$index] }}
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Pending Tasks / Alerts -->
        <div class="alerts-card">
          <h2 class="card-title">Tasks & Alerts</h2>
          <p class="card-subtitle alerts-subtitle">Action required items</p>
          
          <div class="alerts-list">
            @for (alert of alerts; track alert.id) {
              <div class="alert-item">
                <div class="alert-indicator" [classList]="'alert-indicator ' + alert.indicatorType"></div>
                <div class="alert-content">
                  <p class="alert-title">{{ alert.title }}</p>
                  <p class="alert-desc">{{ alert.description }}</p>
                  <p class="alert-time">{{ alert.time }}</p>
                </div>
                <button class="alert-action">{{ alert.actionText }}</button>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Recent Activity Table -->
      <div class="table-card">
        <div class="table-header">
          <div>
            <h2 class="card-title">Recent Test Orders</h2>
            <p class="card-subtitle">Latest 5 orders to be processed</p>
          </div>
          <button class="table-action-link">View All Orders &rarr;</button>
        </div>
        
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Test Name</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th class="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              @for (order of recentOrders; track order.id) {
                <tr>
                  <td>
                    <div class="cell-primary">{{ order.patientName }}</div>
                    <div class="cell-secondary">ID: {{ order.patientId }}</div>
                  </td>
                  <td>
                    <div class="cell-primary">{{ order.testName }}</div>
                    <div class="cell-secondary">{{ order.category }}</div>
                  </td>
                  <td class="cell-standard">{{ order.date }}</td>
                  <td>
                    <span class="status-badge" [classList]="'status-badge ' + getStatusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="text-right">
                    <button class="icon-action-btn">
                      <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent {

  stats = [
    {
      title: 'Total Patients', value: '2,451', trend: 'up', trendValue: '12%',
      icon: '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      typeClass: 'type-indigo'
    },
    {
      title: 'Tests Today', value: '148', trend: 'up', trendValue: '4.5%',
      icon: '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><line x1="5.52" y1="16" x2="18.48" y2="16"/></svg>',
      typeClass: 'type-emerald'
    },
    {
      title: 'Pending Reports', value: '32', trend: 'down', trendValue: '2.1%',
      icon: '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
      typeClass: 'type-amber'
    },
    {
      title: 'Revenue (Today)', value: '$4,250', trend: 'up', trendValue: '8.4%',
      icon: '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      typeClass: 'type-sky'
    }
  ];

  quickActions = [
    { title: 'Add Patient', subtitle: 'Register new', icon: '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>', typeClass: 'type-blue' },
    { title: 'Create Order', subtitle: 'New test entry', icon: '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>', typeClass: 'type-emerald' },
    { title: 'Enter Results', subtitle: 'Update findings', icon: '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3-6 6"/><path d="M3 21l6-6"/></svg>', typeClass: 'type-purple' },
    { title: 'Generate Report', subtitle: 'Export data', icon: '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>', typeClass: 'type-rose' },
  ];

  alerts = [
    { id: 1, title: 'Critical Value Alert', description: 'Patient "Raj K." HbA1c is 11.2%', time: '10 mins ago', actionText: 'Review now', indicatorType: 'indicator-red' },
    { id: 2, title: 'Pending Reports', description: '12 reports from yesterday are still pending review.', time: '1 hour ago', actionText: 'View pending', indicatorType: 'indicator-amber' },
    { id: 3, title: 'Low Inventory', description: 'Glucose strips are running low (2 days supply left).', time: '3 hours ago', actionText: 'Order stock', indicatorType: 'indicator-orange' },
    { id: 4, title: 'Equipment Maintenance', description: 'Centrifuge machine 2 requires monthly service.', time: 'Yesterday', actionText: 'Schedule', indicatorType: 'indicator-blue' }
  ];

  recentOrders = [
    { id: 'ORD-291', patientName: 'Ahmed H.', patientId: 'PT-8821', testName: 'Complete Blood Count (CBC)', category: 'Hematology', date: 'Today, 09:30 AM', status: 'Completed' },
    { id: 'ORD-292', patientName: 'Priya M.', patientId: 'PT-4390', testName: 'Lipid Profile', category: 'Biochemistry', date: 'Today, 10:15 AM', status: 'Pending Review' },
    { id: 'ORD-293', patientName: 'Amit S.', patientId: 'PT-1123', testName: 'Thyroid Panel', category: 'Biochemistry', date: 'Today, 11:00 AM', status: 'In Progress' },
    { id: 'ORD-294', patientName: 'Sarah J.', patientId: 'PT-7642', testName: 'Urine Culture', category: 'Microbiology', date: 'Today, 11:45 AM', status: 'Sample Collected' },
    { id: 'ORD-295', patientName: 'Ravi K.', patientId: 'PT-5531', testName: 'HbA1c', category: 'Pathology', date: 'Today, 12:20 PM', status: 'Pending Review' },
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'status-success';
      case 'Pending Review': return 'status-warning';
      case 'In Progress': return 'status-info';
      case 'Sample Collected': return 'status-neutral';
      default: return 'status-neutral';
    }
  }
}
