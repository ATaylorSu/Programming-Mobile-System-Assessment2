/**
 * Search Page Component
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Part: Part 2 - Angular
 */

import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import { InventoryItem, Category, StockStatus, InventoryFilter } from '../../models';

@Component({
  selector: 'app-search',
  template: `
    <div class="search-page">
      <div class="page-header">
        <div class="container">
          <h1>Search & Filter</h1>
          <p>Find inventory items by name, category, stock status, or popularity</p>
        </div>
      </div>

      <div class="container">
        <div class="search-container">
          <div class="search-filters">
            <h2>Search Filters</h2>

            <div class="form-group">
              <label>Search by Name</label>
              <input type="text" [(ngModel)]="filter.searchTerm" (keyup.enter)="performSearch()" placeholder="Enter item name..." class="search-input">
            </div>

            <div class="filter-row">
              <div class="form-group">
                <label>Category</label>
                <select [(ngModel)]="filter.category">
                  <option value="">All Categories</option>
                  <option *ngFor="let cat of categoryOptions" [value]="cat">{{ cat }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Stock Status</label>
                <select [(ngModel)]="filter.stockStatus">
                  <option value="">All Statuses</option>
                  <option *ngFor="let status of stockStatusOptions" [value]="status">{{ status }}</option>
                </select>
              </div>

              <div class="form-group checkbox-group">
                <label class="checkbox-wrapper">
                  <input type="checkbox" [(ngModel)]="filter.showPopularOnly">
                  <span>Popular Items Only</span>
                </label>
              </div>
            </div>

            <div class="search-actions">
              <button class="btn btn-primary" (click)="performSearch()">
                <span>🔍</span> Search
              </button>
              <button class="btn btn-secondary" (click)="showAll()">
                <span>📋</span> Show All
              </button>
              <button class="btn btn-secondary" (click)="showPopular()">
                <span>⭐</span> Show Popular
              </button>
              <button class="btn btn-secondary" (click)="clearFilters()">
                <span>🔄</span> Clear Filters
              </button>
            </div>
          </div>

          <div class="search-results">
            <div class="results-header">
              <h2>Results</h2>
              <span class="item-count">{{ results.length }} items found</span>
            </div>

            <div *ngIf="results.length === 0" class="empty-state">
              <span class="icon">🔍</span>
              <h3>No items found</h3>
              <p>Try adjusting your search criteria</p>
            </div>

            <div class="results-grid">
              <div *ngFor="let item of results" class="result-card">
                <div class="card-header">
                  <span class="item-name">{{ item.name }}</span>
                  <span *ngIf="item.isPopular" class="badge badge-popular">⭐ Popular</span>
                </div>
                <div class="card-body">
                  <div class="card-id">{{ item.id }}</div>
                  <div class="card-details">
                    <div class="detail-row">
                      <span class="detail-label">Category:</span>
                      <span class="badge" [ngClass]="'badge-' + item.category.toLowerCase()">{{ item.category }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Quantity:</span>
                      <span class="detail-value">{{ item.quantity }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Price:</span>
                      <span class="detail-value price">{{ item.price | currency }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Supplier:</span>
                      <span class="detail-value">{{ item.supplier }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Status:</span>
                      <span class="badge" [ngClass]="getStatusBadgeClass(item.stockStatus)">{{ item.stockStatus }}</span>
                    </div>
                  </div>
                  <div *ngIf="item.notes" class="card-notes">
                    <strong>Notes:</strong> {{ item.notes }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      background-color: var(--bg-secondary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
      margin-bottom: var(--spacing-xl);
    }

    .search-filters {
      margin-bottom: var(--spacing-xl);
      padding-bottom: var(--spacing-xl);
      border-bottom: 1px solid var(--border-color);
    }

    .search-filters h2 {
      font-size: var(--font-xl);
      margin-bottom: var(--spacing-lg);
      color: var(--text-primary);
    }

    .search-input {
      width: 100%;
      padding: var(--spacing-md);
      font-size: var(--font-base);
    }

    .filter-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--spacing-md);
      margin-top: var(--spacing-lg);
    }

    .checkbox-group {
      display: flex;
      align-items: flex-end;
      padding-bottom: var(--spacing-sm);
    }

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      cursor: pointer;
      font-size: var(--font-sm);
    }

    .checkbox-wrapper input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .search-actions {
      display: flex;
      gap: var(--spacing-md);
      margin-top: var(--spacing-lg);
      flex-wrap: wrap;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }

    .results-header h2 {
      font-size: var(--font-xl);
      color: var(--text-primary);
    }

    .item-count {
      background-color: var(--bg-tertiary);
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: 20px;
      font-size: var(--font-sm);
      color: var(--text-secondary);
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--spacing-lg);
    }

    .result-card {
      background-color: var(--bg-secondary);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      overflow: hidden;
      transition: all var(--transition-fast);
    }

    .result-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      background-color: var(--bg-tertiary);
      border-bottom: 1px solid var(--border-color);
    }

    .item-name {
      font-size: var(--font-lg);
      font-weight: 600;
      color: var(--text-primary);
    }

    .card-body {
      padding: var(--spacing-md);
    }

    .card-id {
      font-size: var(--font-xs);
      color: var(--text-muted);
      margin-bottom: var(--spacing-md);
    }

    .card-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .detail-label {
      font-size: var(--font-sm);
      color: var(--text-secondary);
    }

    .detail-value {
      font-size: var(--font-sm);
      font-weight: 500;
      color: var(--text-primary);
    }

    .detail-value.price {
      color: var(--primary-color);
      font-weight: 600;
    }

    .card-notes {
      margin-top: var(--spacing-md);
      padding: var(--spacing-sm);
      background-color: var(--bg-tertiary);
      border-radius: var(--border-radius);
      font-size: var(--font-sm);
      color: var(--text-secondary);
    }

    .badge-electronics { background-color: #d1fae5; color: #166534; }
    .badge-furniture { background-color: #fef3c7; color: #92400e; }
    .badge-clothing { background-color: #fce7f3; color: #9d174d; }
    .badge-tools { background-color: #dcfce7; color: #14532d; }
    .badge-miscellaneous { background-color: #f3f4f6; color: #374151; }

    @media (max-width: 768px) {
      .search-actions {
        flex-direction: column;
      }

      .search-actions .btn {
        width: 100%;
      }

      .results-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SearchComponent implements OnInit {
  results: InventoryItem[] = [];
  filter: InventoryFilter = {};

  categoryOptions = Object.values(Category);
  stockStatusOptions = Object.values(StockStatus);

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.results = this.inventoryService.getAllItems();
  }

  performSearch(): void {
    this.results = this.inventoryService.filterItems(this.filter);
  }

  showAll(): void {
    this.clearFilters();
    this.results = this.inventoryService.getAllItems();
  }

  showPopular(): void {
    this.clearFilters();
    this.results = this.inventoryService.getPopularItems();
  }

  clearFilters(): void {
    this.filter = {};
  }

  getStatusBadgeClass(status: StockStatus): string {
    switch (status) {
      case StockStatus.InStock: return 'badge-success';
      case StockStatus.LowStock: return 'badge-warning';
      case StockStatus.OutOfStock: return 'badge-danger';
      default: return 'badge-info';
    }
  }
}
