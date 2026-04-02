/**
 * Privacy Page Component
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Part: Part 2 - Angular
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  template: `
    <div class="privacy-page">
      <div class="page-header">
        <div class="container">
          <h1>Privacy & Security Analysis</h1>
          <p>Understanding the privacy and security considerations in our application</p>
        </div>
      </div>

      <div class="container">
        <div class="content-section">
          <h2>🔒 Data Storage Security</h2>
          <div class="card">
            <div class="card-body">
              <h3>Client-Side Data Storage</h3>
              <p>
                Our inventory management system stores all data locally within the browser's memory using Angular services.
                This means data persists only during the browser session. When the browser is closed or the page is refreshed,
                data is reset to initial sample values.
              </p>
              <h4>Security Implications:</h4>
              <ul>
                <li><strong>No Server Exposure:</strong> Data never leaves the user's device, eliminating server-side data breach risks.</li>
                <li><strong>Session Isolation:</strong> Each browser session maintains its own data state.</li>
                <li><strong>No Cross-Device Sync:</strong> Data changes made on one device are not visible on other devices.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .content-section {
      margin-bottom: var(--spacing-xl);
    }

    .content-section h2 {
      font-size: var(--font-xl);
      color: var(--text-primary);
      margin-bottom: var(--spacing-md);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .card {
      background-color: var(--bg-secondary);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .card.warning-card {
      border-left: 4px solid var(--warning-color);
    }

    .card-body {
      padding: var(--spacing-xl);
    }

    .card-body h3 {
      font-size: var(--font-lg);
      color: var(--text-primary);
      margin-bottom: var(--spacing-md);
    }

    .card-body h4 {
      font-size: var(--font-base);
      color: var(--text-secondary);
      margin-top: var(--spacing-lg);
      margin-bottom: var(--spacing-sm);
    }

    .card-body p {
      color: var(--text-secondary);
      line-height: 1.8;
      margin-bottom: var(--spacing-md);
    }

    .card-body ul {
      list-style: none;
      padding: 0;
    }

    .card-body ul li {
      color: var(--text-secondary);
      padding: var(--spacing-sm) 0;
      padding-left: var(--spacing-lg);
      position: relative;
      line-height: 1.6;
    }

    .card-body ul li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--primary-color);
      font-weight: bold;
    }

    .card-body a {
      color: var(--primary-color);
      word-break: break-all;
    }

    .card-body a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .content-section h2 {
        font-size: var(--font-lg);
      }
    }
  `]
})
export class PrivacyComponent {}
