/**
 * Home Page Component
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Part: Part 2 - Angular
 */

import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { InventoryItem } from '../../models';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-page">
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1>Inventory Management System</h1>
            <p class="hero-subtitle">Part 2 - Angular Application</p>
            <p class="hero-desc">
              A modern, responsive inventory management application built with Angular.
              Manage your products efficiently with full CRUD operations, powerful search,
              and real-time filtering capabilities.
            </p>
            <div class="hero-actions">
              <a routerLink="/inventory" class="btn btn-primary btn-lg">
                <span>📦</span> Go to Inventory
              </a>
              <a routerLink="/search" class="btn btn-secondary btn-lg">
                <span>🔍</span> Search Items
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-value">{{ stats.totalItems }}</div>
              <div class="stat-label">Total Items</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-value">{{ stats.popularCount }}</div>
              <div class="stat-label">Popular Items</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-value">{{ stats.totalValue | currency:'USD':'symbol':'1.2-2' }}</div>
              <div class="stat-label">Total Value</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🔄</div>
              <div class="stat-value">5</div>
              <div class="stat-label">Categories</div>
            </div>
          </div>
        </div>
      </section>

      <section class="features-section">
        <div class="container">
          <h2 class="section-title">Key Features</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">➕</div>
              <h3>Add Items</h3>
              <p>Create new inventory items with full validation. Support for all product categories and stock statuses.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">✏️</div>
              <h3>Edit Items</h3>
              <p>Update item details easily using item name as the identifier. Partial updates supported.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🗑️</div>
              <h3>Delete Items</h3>
              <p>Remove items with confirmation dialog to prevent accidental deletions.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔍</div>
              <h3>Search & Filter</h3>
              <p>Find items by name, category, stock status, or popularity with powerful filtering.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>Works seamlessly on desktop, tablet, and mobile devices with adaptive layouts.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔒</div>
              <h3>Privacy & Security</h3>
              <p>Built with security best practices. Read our privacy analysis for details.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="quick-links-section">
        <div class="container">
          <h2 class="section-title">Quick Navigation</h2>
          <div class="quick-links-grid">
            <a routerLink="/inventory" class="quick-link-card">
              <span class="quick-link-icon">📦</span>
              <span class="quick-link-text">Manage Inventory</span>
              <span class="quick-link-arrow">→</span>
            </a>
            <a routerLink="/search" class="quick-link-card">
              <span class="quick-link-icon">🔍</span>
              <span class="quick-link-text">Search Items</span>
              <span class="quick-link-arrow">→</span>
            </a>
            <a routerLink="/privacy" class="quick-link-card">
              <span class="quick-link-icon">🔐</span>
              <span class="quick-link-text">Privacy & Security</span>
              <span class="quick-link-arrow">→</span>
            </a>
            <a routerLink="/help" class="quick-link-card">
              <span class="quick-link-icon">❓</span>
              <span class="quick-link-text">Help & FAQ</span>
              <span class="quick-link-arrow">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: white;
      padding: 80px 0;
      text-align: center;
    }

    .hero-content {
      max-width: 700px;
      margin: 0 auto;
    }

    .hero h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: var(--spacing-sm);
    }

    .hero-subtitle {
      font-size: var(--font-lg);
      opacity: 0.9;
      margin-bottom: var(--spacing-lg);
    }

    .hero-desc {
      font-size: var(--font-base);
      opacity: 0.85;
      line-height: 1.8;
      margin-bottom: var(--spacing-xl);
    }

    .hero-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-lg {
      padding: var(--spacing-md) var(--spacing-xl);
      font-size: var(--font-base);
    }

    .stats-section {
      padding: 60px 0;
      background-color: var(--bg-tertiary);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-lg);
    }

    .stat-card {
      background-color: var(--bg-secondary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-xl);
      text-align: center;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
    }

    .stat-icon {
      font-size: 2rem;
      margin-bottom: var(--spacing-md);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: var(--spacing-xs);
    }

    .stat-label {
      font-size: var(--font-sm);
      color: var(--text-secondary);
    }

    .features-section {
      padding: 60px 0;
    }

    .section-title {
      font-size: var(--font-2xl);
      font-weight: 700;
      text-align: center;
      margin-bottom: var(--spacing-xl);
      color: var(--text-primary);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-lg);
    }

    .feature-card {
      background-color: var(--bg-secondary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      text-align: center;
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: var(--spacing-md);
    }

    .feature-card h3 {
      font-size: var(--font-lg);
      margin-bottom: var(--spacing-sm);
      color: var(--text-primary);
    }

    .feature-card p {
      font-size: var(--font-sm);
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .quick-links-section {
      padding: 60px 0;
      background-color: var(--bg-tertiary);
    }

    .quick-links-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--spacing-md);
    }

    .quick-link-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      background-color: var(--bg-secondary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      transition: all var(--transition-fast);
      text-decoration: none;
      color: var(--text-primary);
    }

    .quick-link-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
    }

    .quick-link-icon {
      font-size: 1.5rem;
    }

    .quick-link-text {
      flex: 1;
      font-weight: 500;
    }

    .quick-link-arrow {
      color: var(--primary-color);
      font-size: var(--font-lg);
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 1.75rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: center;
      }

      .hero-actions .btn {
        width: 100%;
        max-width: 280px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  stats = { totalItems: 0, popularCount: 0, totalValue: 0 };

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.stats = this.inventoryService.getStatistics();
  }
}
