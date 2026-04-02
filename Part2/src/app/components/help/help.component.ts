import { Component } from '@angular/core';

@Component({
  selector: 'app-help',
  template: `
    <div class="help-page">
      <div class="page-header">
        <div class="container">
          <h1>Help & FAQ</h1>
          <p>Find answers to common questions and troubleshooting guidance</p>
        </div>
      </div>

      <div class="container">
        <section class="quick-start">
          <h2>🚀 Quick Start Guide</h2>
          <div class="card">
            <div class="card-body">
              <h3>Getting Started</h3>
              <ol class="step-list">
                <li>
                  <strong>Home Page:</strong> The home page displays an overview of your inventory with statistics.
                </li>
                <li>
                  <strong>Navigate to Inventory:</strong> Click on "Inventory" in the navigation menu to manage items.
                </li>
                <li>
                  <strong>Use the Tabbed Interface:</strong> Switch between View All, Add, Update, and Delete tabs.
                </li>
                <li>
                  <strong>Search Items:</strong> Use the Search page to find items by name, category, or status.
                </li>
                <li>
                  <strong>Read Privacy Info:</strong> Visit the Privacy page to learn about data handling.
                </li>
              </ol>
            </div>
          </div>
        </section>

        <section class="faq-section">
          <h2>❓ Frequently Asked Questions</h2>

          <div class="faq-item" *ngFor="let faq of faqs; let i = index">
            <button class="faq-question" (click)="toggleFaq(i)" [class.expanded]="expandedFaq === i">
              <span>{{ faq.question }}</span>
              <span class="faq-icon">{{ expandedFaq === i ? '−' : '+' }}</span>
            </button>
            <div class="faq-answer" [class.open]="expandedFaq === i">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </section>

        <section class="troubleshooting">
          <h2>🔧 Troubleshooting</h2>

          <div class="card-grid">
            <div class="card">
              <div class="card-body">
                <h3>Cannot Add Item</h3>
                <p><strong>Problem:</strong> Getting an error when trying to add an item.</p>
                <p><strong>Solutions:</strong></p>
                <ul>
                  <li>Make sure Item ID is 3-20 alphanumeric characters</li>
                  <li>Ensure Item ID is unique (not used by another item)</li>
                  <li>Fill in all required fields marked with *</li>
                  <li>Quantity and Price must be 0 or positive numbers</li>
                </ul>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h3>Cannot Find Item to Update</h3>
                <p><strong>Problem:</strong> Item not found when updating.</p>
                <p><strong>Solutions:</strong></p>
                <ul>
                  <li>Check the spelling of the item name (case-insensitive)</li>
                  <li>View all items first to see the exact name</li>
                  <li>Use the Search page to find items</li>
                </ul>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h3>Delete Confirmation Not Appearing</h3>
                <p><strong>Problem:</strong> Delete doesn't show confirmation.</p>
                <p><strong>Solution:</strong> Make sure you entered the exact item name before clicking Delete. The confirmation modal requires a valid item name.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="keyboard-shortcuts">
          <h2>⌨️ Navigation Tips</h2>
          <div class="card">
            <div class="card-body">
              <div class="shortcuts-grid">
                <div class="shortcut-item">
                  <span class="shortcut-key">Home Page</span>
                  <span class="shortcut-desc">Click "Home" in the navigation bar</span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-key">Inventory</span>
                  <span class="shortcut-desc">Click "Inventory" to manage items</span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-key">Search</span>
                  <span class="shortcut-desc">Click "Search" to find items</span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-key">Mobile Menu</span>
                  <span class="shortcut-desc">Click the hamburger icon on mobile</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    section {
      margin-bottom: var(--spacing-xl);
    }

    section h2 {
      font-size: var(--font-xl);
      color: var(--text-primary);
      margin-bottom: var(--spacing-md);
    }

    .card {
      background-color: var(--bg-secondary);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .card-body {
      padding: var(--spacing-xl);
    }

    .card-body h3 {
      font-size: var(--font-lg);
      color: var(--text-primary);
      margin-bottom: var(--spacing-md);
    }

    .card-body p {
      color: var(--text-secondary);
      line-height: 1.7;
      margin-bottom: var(--spacing-sm);
    }

    .card-body ul {
      list-style: disc;
      padding-left: var(--spacing-lg);
      color: var(--text-secondary);
    }

    .card-body ul li {
      margin-bottom: var(--spacing-xs);
      line-height: 1.6;
    }

    .step-list {
      list-style: none;
      padding: 0;
      counter-reset: step-counter;
    }

    .step-list li {
      counter-increment: step-counter;
      padding: var(--spacing-md) 0;
      padding-left: var(--spacing-xl);
      position: relative;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .step-list li:last-child {
      border-bottom: none;
    }

    .step-list li::before {
      content: counter(step-counter);
      position: absolute;
      left: 0;
      width: 28px;
      height: 28px;
      background-color: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: var(--font-sm);
    }

    .faq-item {
      background-color: var(--bg-secondary);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      margin-bottom: var(--spacing-md);
      overflow: hidden;
    }

    .faq-question {
      width: 100%;
      padding: var(--spacing-lg);
      background: none;
      border: none;
      text-align: left;
      font-size: var(--font-base);
      font-weight: 500;
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--spacing-md);
      transition: background-color var(--transition-fast);
    }

    .faq-question:hover {
      background-color: var(--bg-tertiary);
    }

    .faq-question.expanded {
      background-color: var(--bg-tertiary);
      border-bottom: 1px solid var(--border-color);
    }

    .faq-icon {
      font-size: var(--font-xl);
      color: var(--primary-color);
      font-weight: 300;
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height var(--transition-normal);
    }

    .faq-answer.open {
      max-height: 500px;
    }

    .faq-answer p {
      padding: var(--spacing-lg);
      color: var(--text-secondary);
      line-height: 1.7;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .shortcuts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-md);
    }

    .shortcut-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
      padding: var(--spacing-md);
      background-color: var(--bg-tertiary);
      border-radius: var(--border-radius);
    }

    .shortcut-key {
      font-weight: 600;
      color: var(--text-primary);
      font-size: var(--font-sm);
    }

    .shortcut-desc {
      color: var(--text-secondary);
      font-size: var(--font-sm);
    }

    .contact-card {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      color: white;
    }

    .contact-card h3 {
      color: white;
    }

    .contact-card p {
      color: rgba(255, 255, 255, 0.9);
    }

    .tech-stack {
      display: flex;
      gap: var(--spacing-sm);
      justify-content: center;
      flex-wrap: wrap;
      margin-top: var(--spacing-lg);
    }

    .tech-badge {
      padding: var(--spacing-xs) var(--spacing-md);
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      font-size: var(--font-sm);
      font-weight: 500;
    }

    @media (max-width: 768px) {
      section h2 {
        font-size: var(--font-lg);
      }

      .card-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HelpComponent {
  expandedFaq: number | null = null;

  faqs = [
    {
      question: 'How do I add a new inventory item?',
      answer: 'Navigate to the Inventory page, click the "Add Item" tab, fill in all required fields (Item ID, Name, Category, Quantity, Price, Supplier, Stock Status), and click "Add Item". Make sure the Item ID is unique and between 3-20 characters.'
    },
    {
      question: 'How do I update an existing item?',
      answer: 'Go to the Inventory page, click the "Update Item" tab. Enter the current item name in Step 1, then fill in only the fields you want to change in Step 2. Leave fields blank to keep their current values. Click "Update Item" to save.'
    },
    {
      question: 'How do I delete an item?',
      answer: 'Navigate to the Inventory page, click the "Delete Item" tab. Enter the exact item name and click "Delete Item". A confirmation dialog will appear - click "Delete" to confirm or "Cancel" to abort.'
    },
    {
      question: 'How does the search work?',
      answer: 'The Search page allows you to filter items by: (1) Name - type a search term to find items containing that text, (2) Category - select a category to show only items in that category, (3) Stock Status - filter by In Stock, Low Stock, or Out of Stock, (4) Popular - check the box to show only popular items. You can combine multiple filters.'
    }
  ];

  toggleFaq(index: number): void {
    this.expandedFaq = this.expandedFaq === index ? null : index;
  }
}
