/**
 * Root Application Component
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Part: Part 2 - Angular
 */

import { Component, OnInit, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, Routes, RouterOutlet } from '@angular/router';

// ============================================================================
// MODELS
// ============================================================================

export enum Category {
  Electronics = 'Electronics',
  Furniture = 'Furniture',
  Clothing = 'Clothing',
  Tools = 'Tools',
  Miscellaneous = 'Miscellaneous'
}

export enum StockStatus {
  InStock = 'In Stock',
  LowStock = 'Low Stock',
  OutOfStock = 'Out of Stock'
}

export interface InventoryItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  price: number;
  supplier: string;
  stockStatus: StockStatus;
  isPopular: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInventoryItemDTO {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  price: number;
  supplier: string;
  stockStatus: StockStatus;
  isPopular: boolean;
  notes?: string;
}

export interface UpdateInventoryItemDTO {
  name?: string;
  category?: Category;
  quantity?: number;
  price?: number;
  supplier?: string;
  stockStatus?: StockStatus;
  isPopular?: boolean | null;
  notes?: string;
}

export interface InventoryFilter {
  searchTerm?: string;
  category?: Category;
  stockStatus?: StockStatus;
  showPopularOnly?: boolean;
}

export interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const SAMPLE_INVENTORY_DATA: CreateInventoryItemDTO[] = [
  { id: 'SCU001', name: 'iPhone 17 Pro Max', category: Category.Electronics, quantity: 30, price: 1599.00, supplier: 'Apple Inc.', stockStatus: StockStatus.InStock, isPopular: true, notes: 'Latest flagship smartphone with A19 Pro chip' },
  { id: 'SCU002', name: 'Louis Vuitton Neverfull MM', category: Category.Miscellaneous, quantity: 5, price: 2030.00, supplier: 'Louis Vuitton', stockStatus: StockStatus.LowStock, isPopular: true, notes: 'Iconic monogram canvas tote bag' },
  { id: 'SCU003', name: 'Huawei MateBook X Pro', category: Category.Electronics, quantity: 12, price: 1499.00, supplier: 'Huawei Technologies', stockStatus: StockStatus.InStock, isPopular: false, notes: 'Ultra-slim 13th Gen Intel Core laptop' },
  { id: 'SCU004', name: 'Chanel N\u00b05 Eau de Parfum', category: Category.Miscellaneous, quantity: 0, price: 185.00, supplier: 'Chanel', stockStatus: StockStatus.OutOfStock, isPopular: true, notes: 'Iconic floral fragrance, 100ml' },
  { id: 'SCU005', name: 'Est\u00e9e Lauder Double Wear Foundation', category: Category.Miscellaneous, quantity: 48, price: 64.00, supplier: 'Est\u00e9e Lauder Companies', stockStatus: StockStatus.InStock, isPopular: true, notes: '24-hour liquid foundation, multiple shades' }
];

// ============================================================================
// SERVICE
// ============================================================================

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private inventory: InventoryItem[] = [];

  constructor() {
    const now = new Date();
    this.inventory = SAMPLE_INVENTORY_DATA.map((item) => ({ ...item, createdAt: now, updatedAt: now }));
  }

  private getItemByName(name: string): InventoryItem | undefined {
    return this.inventory.find((item) => item.name.toLowerCase() === name.toLowerCase());
  }

  createItem(data: CreateInventoryItemDTO): OperationResult<InventoryItem> {
    if (!data.id || data.id.trim().length < 3 || data.id.trim().length > 20) {
      return { success: false, error: 'Item ID must be 3-20 characters' };
    }
    if (!/^[a-zA-Z0-9]+$/.test(data.id.trim())) {
      return { success: false, error: 'Item ID must be alphanumeric' };
    }
    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: 'Item name is required' };
    }
    if (data.quantity < 0 || data.price < 0) {
      return { success: false, error: 'Quantity and Price cannot be negative' };
    }
    if (this.inventory.some((item) => item.id.toLowerCase() === data.id.trim().toLowerCase())) {
      return { success: false, error: `An item with ID "${data.id}" already exists` };
    }
    if (this.inventory.some((item) => item.name.toLowerCase() === data.name.trim().toLowerCase())) {
      return { success: false, error: `An item with name "${data.name}" already exists` };
    }
    const now = new Date();
    const newItem: InventoryItem = { ...data, id: data.id.trim(), name: data.name.trim(), quantity: Number(data.quantity), price: Number(data.price), supplier: data.supplier.trim(), createdAt: now, updatedAt: now };
    this.inventory.push(newItem);
    return { success: true, data: newItem };
  }

  updateItem(name: string, data: UpdateInventoryItemDTO): OperationResult<InventoryItem> {
    const item = this.getItemByName(name);
    if (!item) return { success: false, error: `Item with name "${name}" not found` };
    if (data.name && data.name.trim() !== name) {
      if (this.inventory.some((i) => i.id !== item.id && i.name.toLowerCase() === data.name!.trim().toLowerCase())) {
        return { success: false, error: `Another item with name "${data.name}" already exists` };
      }
    }
    if (data.quantity !== undefined && data.quantity < 0) return { success: false, error: 'Quantity cannot be negative' };
    if (data.price !== undefined && data.price < 0) return { success: false, error: 'Price cannot be negative' };
    const popValue = data.isPopular !== undefined && data.isPopular !== null;
    const updatedItem: InventoryItem = {
      ...item,
      id: item.id,
      name: data.name ? data.name.trim() : item.name,
      quantity: data.quantity !== undefined ? Number(data.quantity) : item.quantity,
      price: data.price !== undefined ? Number(data.price) : item.price,
      supplier: data.supplier ? data.supplier.trim() : item.supplier,
      category: data.category || item.category,
      stockStatus: data.stockStatus || item.stockStatus,
      isPopular: popValue ? data.isPopular as boolean : item.isPopular,
      notes: data.notes !== undefined ? data.notes : item.notes,
      updatedAt: new Date()
    };
    const index = this.inventory.findIndex((i) => i.id === item.id);
    if (index !== -1) this.inventory[index] = updatedItem;
    return { success: true, data: updatedItem };
  }

  deleteItem(name: string): OperationResult<InventoryItem> {
    const item = this.getItemByName(name);
    if (!item) return { success: false, error: `Item with name "${name}" not found` };
    const index = this.inventory.findIndex((i) => i.id === item.id);
    if (index !== -1) this.inventory.splice(index, 1);
    return { success: true, data: item };
  }

  getAllItems(): InventoryItem[] { return [...this.inventory]; }
  getPopularItems(): InventoryItem[] { return this.inventory.filter((item) => item.isPopular); }

  filterItems(filter: InventoryFilter): InventoryItem[] {
    let results = [...this.inventory];
    if (filter.searchTerm) results = results.filter((item) => item.name.toLowerCase().includes(filter.searchTerm!.toLowerCase()));
    if (filter.category) results = results.filter((item) => item.category === filter.category);
    if (filter.stockStatus) results = results.filter((item) => item.stockStatus === filter.stockStatus);
    if (filter.showPopularOnly) results = results.filter((item) => item.isPopular);
    return results;
  }

  getStatistics(): { totalItems: number; totalValue: number; popularCount: number } {
    let totalValue = 0, popularCount = 0;
    this.inventory.forEach((item) => { totalValue += item.price * item.quantity; if (item.isPopular) popularCount++; });
    return { totalItems: this.inventory.length, totalValue, popularCount };
  }
}

// ============================================================================
// HOME COMPONENT
// ============================================================================

@Component({
  selector: 'app-home',
  template: `
    <div class="home-page">
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1>Inventory Management System</h1>
            <p class="hero-subtitle">Part 2 - Angular Application</p>
            <p class="hero-desc">A modern, responsive inventory management application built with Angular. Manage your products efficiently with full CRUD operations, powerful search, and real-time filtering capabilities.</p>
            <div class="hero-actions">
              <a routerLink="/inventory" class="btn btn-primary btn-lg"><span>&#128230;</span> Go to Inventory</a>
              <a routerLink="/search" class="btn btn-secondary btn-lg"><span>&#128269;</span> Search Items</a>
            </div>
          </div>
        </div>
      </section>
      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-icon">&#128202;</div><div class="stat-value">{{ stats.totalItems }}</div><div class="stat-label">Total Items</div></div>
            <div class="stat-card"><div class="stat-icon">&#11088;</div><div class="stat-value">{{ stats.popularCount }}</div><div class="stat-label">Popular Items</div></div>
            <div class="stat-card"><div class="stat-icon">&#129296;</div><div class="stat-value">{{ stats.totalValue | currency:'USD':'symbol':'1.2-2' }}</div><div class="stat-label">Total Value</div></div>
            <div class="stat-card"><div class="stat-icon">&#128260;</div><div class="stat-value">5</div><div class="stat-label">Categories</div></div>
          </div>
        </div>
      </section>
      <section class="features-section">
        <div class="container">
          <h2 class="section-title">Key Features</h2>
          <div class="features-grid">
            <div class="feature-card"><div class="feature-icon">&#10133;</div><h3>Add Items</h3><p>Create new inventory items with full validation. Support for all product categories and stock statuses.</p></div>
            <div class="feature-card"><div class="feature-icon">&#9998;</div><h3>Edit Items</h3><p>Update item details easily using item name as the identifier. Partial updates supported.</p></div>
            <div class="feature-card"><div class="feature-icon">&#128465;</div><h3>Delete Items</h3><p>Remove items with confirmation dialog to prevent accidental deletions.</p></div>
            <div class="feature-card"><div class="feature-icon">&#128269;</div><h3>Search &amp; Filter</h3><p>Find items by name, category, stock status, or popularity with powerful filtering.</p></div>
            <div class="feature-card"><div class="feature-icon">&#128241;</div><h3>Responsive Design</h3><p>Works seamlessly on desktop, tablet, and mobile devices with adaptive layouts.</p></div>
            <div class="feature-card"><div class="feature-icon">&#128274;</div><h3>Privacy &amp; Security</h3><p>Built with security best practices. Read our privacy analysis for details.</p></div>
          </div>
        </div>
      </section>
      <section class="quick-links-section">
        <div class="container">
          <h2 class="section-title">Quick Navigation</h2>
          <div class="quick-links-grid">
            <a routerLink="/inventory" class="quick-link-card"><span class="quick-link-icon">&#128230;</span><span class="quick-link-text">Manage Inventory</span><span class="quick-link-arrow">&#8594;</span></a>
            <a routerLink="/search" class="quick-link-card"><span class="quick-link-icon">&#128269;</span><span class="quick-link-text">Search Items</span><span class="quick-link-arrow">&#8594;</span></a>
            <a routerLink="/privacy" class="quick-link-card"><span class="quick-link-icon">&#128272;</span><span class="quick-link-text">Privacy &amp; Security</span><span class="quick-link-arrow">&#8594;</span></a>
            <a routerLink="/help" class="quick-link-card"><span class="quick-link-icon">&#10067;</span><span class="quick-link-text">Help &amp; FAQ</span><span class="quick-link-arrow">&#8594;</span></a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero { background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%); color: white; padding: 80px 0; text-align: center; }
    .hero-content { max-width: 700px; margin: 0 auto; }
    .hero h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: var(--spacing-sm); }
    .hero-subtitle { font-size: var(--font-lg); opacity: 0.9; margin-bottom: var(--spacing-lg); }
    .hero-desc { font-size: var(--font-base); opacity: 0.85; line-height: 1.8; margin-bottom: var(--spacing-xl); }
    .hero-actions { display: flex; gap: var(--spacing-md); justify-content: center; flex-wrap: wrap; }
    .btn-lg { padding: var(--spacing-md) var(--spacing-xl); font-size: var(--font-base); }
    .stats-section { padding: 60px 0; background-color: var(--bg-tertiary); }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-lg); }
    .stat-card { background-color: var(--bg-secondary); border-radius: var(--border-radius-lg); padding: var(--spacing-xl); text-align: center; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); }
    .stat-icon { font-size: 2rem; margin-bottom: var(--spacing-md); }
    .stat-value { font-size: 2rem; font-weight: 700; color: var(--primary-color); margin-bottom: var(--spacing-xs); }
    .stat-label { font-size: var(--font-sm); color: var(--text-secondary); }
    .features-section { padding: 60px 0; }
    .section-title { font-size: var(--font-2xl); font-weight: 700; text-align: center; margin-bottom: var(--spacing-xl); color: var(--text-primary); }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-lg); }
    .feature-card { background-color: var(--bg-secondary); border-radius: var(--border-radius-lg); padding: var(--spacing-xl); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); text-align: center; }
    .feature-icon { font-size: 2.5rem; margin-bottom: var(--spacing-md); }
    .feature-card h3 { font-size: var(--font-lg); margin-bottom: var(--spacing-sm); color: var(--text-primary); }
    .feature-card p { font-size: var(--font-sm); color: var(--text-secondary); line-height: 1.6; }
    .quick-links-section { padding: 60px 0; background-color: var(--bg-tertiary); }
    .quick-links-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--spacing-md); }
    .quick-link-card { display: flex; align-items: center; gap: var(--spacing-md); background-color: var(--bg-secondary); border-radius: var(--border-radius-lg); padding: var(--spacing-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); transition: all var(--transition-fast); text-decoration: none; color: var(--text-primary); }
    .quick-link-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); border-color: var(--primary-color); }
    .quick-link-icon { font-size: 1.5rem; }
    .quick-link-text { flex: 1; font-weight: 500; }
    .quick-link-arrow { color: var(--primary-color); font-size: var(--font-lg); }
    @media (max-width: 768px) { .hero h1 { font-size: 1.75rem; } .hero-actions { flex-direction: column; align-items: center; } .hero-actions .btn { width: 100%; max-width: 280px; } }
  `]
})
export class HomeComponent implements OnInit {
  stats = { totalItems: 0, popularCount: 0, totalValue: 0 };
  constructor(private inventoryService: InventoryService) {}
  ngOnInit(): void { this.stats = this.inventoryService.getStatistics(); }
}

// ============================================================================
// INVENTORY COMPONENT
// ============================================================================

@Component({
  selector: 'app-inventory',
  template: `
    <div class="inventory-page">
      <div class="page-header">
        <div class="container"><h1>Inventory Management</h1><p>Add, edit, and delete inventory items</p></div>
      </div>
      <div class="container">
        <div class="tab-nav">
          <button class="tab-btn" [class.active]="activeTab === 'list'" (click)="setTab('list')">&#128203; View All</button>
          <button class="tab-btn" [class.active]="activeTab === 'add'" (click)="setTab('add')">&#10133; Add Item</button>
          <button class="tab-btn" [class.active]="activeTab === 'update'" (click)="setTab('update')">&#9998; Update Item</button>
          <button class="tab-btn" [class.active]="activeTab === 'delete'" (click)="setTab('delete')">&#128465; Delete Item</button>
        </div>
        <div class="tab-content">
          <div *ngIf="activeTab === 'list'" class="tab-panel">
            <div class="panel-header"><h2>All Inventory Items</h2><span class="item-count">{{ items.length }} items</span></div>
            <div *ngIf="items.length === 0" class="empty-state"><span class="icon">&#128230;</span><h3>No items found</h3><p>Add some items to get started</p></div>
            <div class="inventory-grid">
              <div *ngFor="let item of items" class="inventory-card">
                <div class="card-header"><span class="item-name">{{ item.name }}</span><span *ngIf="item.isPopular" class="badge badge-popular">&#11088; Popular</span></div>
                <div class="card-body">
                  <div class="card-id">{{ item.id }}</div>
                  <div class="card-details">
                    <div class="detail-row"><span class="detail-label">Category:</span><span class="badge" [ngClass]="'badge-' + item.category.toLowerCase()">{{ item.category }}</span></div>
                    <div class="detail-row"><span class="detail-label">Quantity:</span><span class="detail-value">{{ item.quantity }}</span></div>
                    <div class="detail-row"><span class="detail-label">Price:</span><span class="detail-value price">{{ item.price | currency }}</span></div>
                    <div class="detail-row"><span class="detail-label">Supplier:</span><span class="detail-value">{{ item.supplier }}</span></div>
                    <div class="detail-row"><span class="detail-label">Status:</span><span class="badge" [ngClass]="getStatusBadgeClass(item.stockStatus)">{{ item.stockStatus }}</span></div>
                  </div>
                  <div *ngIf="item.notes" class="card-notes"><strong>Notes:</strong> {{ item.notes }}</div>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="activeTab === 'add'" class="tab-panel">
            <div class="form-container">
              <h2>Add New Item</h2>
              <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>
              <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
              <form (ngSubmit)="onAddItem()">
                <div class="form-row">
                  <div class="form-group"><label>Item ID *</label><input type="text" [(ngModel)]="addForm.id" name="id" placeholder="e.g., INV001" required></div>
                  <div class="form-group"><label>Item Name *</label><input type="text" [(ngModel)]="addForm.name" name="name" placeholder="e.g., MacBook Pro" required></div>
                </div>
                <div class="form-row">
                  <div class="form-group"><label>Category *</label><select [(ngModel)]="addForm.category" name="category" required><option value="">Select Category</option><option *ngFor="let cat of categoryOptions" [value]="cat">{{ cat }}</option></select></div>
                  <div class="form-group"><label>Stock Status *</label><select [(ngModel)]="addForm.stockStatus" name="stockStatus" required><option value="">Select Status</option><option *ngFor="let s of stockStatusOptions" [value]="s">{{ s }}</option></select></div>
                </div>
                <div class="form-row">
                  <div class="form-group"><label>Quantity *</label><input type="number" [(ngModel)]="addForm.quantity" name="quantity" min="0" placeholder="0" required></div>
                  <div class="form-group"><label>Price (USD) *</label><input type="number" [(ngModel)]="addForm.price" name="price" min="0" step="0.01" placeholder="0.00" required></div>
                </div>
                <div class="form-group"><label>Supplier *</label><input type="text" [(ngModel)]="addForm.supplier" name="supplier" placeholder="e.g., Apple Inc." required></div>
                <div class="form-group"><label>Popular Item</label>
                  <div class="radio-group">
                    <label class="radio-label"><input type="radio" [(ngModel)]="addForm.isPopular" name="isPopular" [value]="true"> Yes</label>
                    <label class="radio-label"><input type="radio" [(ngModel)]="addForm.isPopular" name="isPopular" [value]="false"> No</label>
                  </div>
                </div>
                <div class="form-group"><label>Notes</label><textarea [(ngModel)]="addForm.notes" name="notes" placeholder="Optional notes..."></textarea></div>
                <div class="form-actions"><button type="submit" class="btn btn-primary">Add Item</button><button type="button" class="btn btn-secondary" (click)="resetAddForm()">Reset</button></div>
              </form>
            </div>
          </div>
          <div *ngIf="activeTab === 'update'" class="tab-panel">
            <div class="form-container">
              <h2>Update Item</h2>
              <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>
              <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
              <form (ngSubmit)="onUpdateItem()">
                <div class="form-section"><h3>Step 1: Find Item</h3>
                  <div class="form-group"><label>Current Item Name *</label><input type="text" [(ngModel)]="updateForm.currentName" name="currentName" placeholder="Enter current item name" required></div>
                </div>
                <div class="form-section"><h3>Step 2: Update Details (leave blank to keep current)</h3>
                  <div class="form-group"><label>New Name</label><input type="text" [(ngModel)]="updateForm.name" name="name" placeholder="New item name"></div>
                  <div class="form-row">
                    <div class="form-group"><label>Category</label><select [(ngModel)]="updateForm.category" name="category"><option value="">Keep Current</option><option *ngFor="let cat of categoryOptions" [value]="cat">{{ cat }}</option></select></div>
                    <div class="form-group"><label>Stock Status</label><select [(ngModel)]="updateForm.stockStatus" name="stockStatus"><option value="">Keep Current</option><option *ngFor="let s of stockStatusOptions" [value]="s">{{ s }}</option></select></div>
                  </div>
                  <div class="form-row">
                    <div class="form-group"><label>Quantity</label><input type="number" [(ngModel)]="updateForm.quantity" name="quantity" min="0" placeholder="New quantity"></div>
                    <div class="form-group"><label>Price (USD)</label><input type="number" [(ngModel)]="updateForm.price" name="price" min="0" step="0.01" placeholder="New price"></div>
                  </div>
                  <div class="form-group"><label>Supplier</label><input type="text" [(ngModel)]="updateForm.supplier" name="supplier" placeholder="New supplier name"></div>
                  <div class="form-group"><label>Popular Item</label>
                    <div class="radio-group">
                      <label class="radio-label"><input type="radio" [(ngModel)]="updateForm.isPopular" name="isPopular" [value]="true"> Yes</label>
                      <label class="radio-label"><input type="radio" [(ngModel)]="updateForm.isPopular" name="isPopular" [value]="false"> No</label>
                      <label class="radio-label"><input type="radio" [(ngModel)]="updateForm.isPopular" name="isPopular" [value]="null"> Keep Current</label>
                    </div>
                  </div>
                  <div class="form-group"><label>Notes</label><textarea [(ngModel)]="updateForm.notes" name="notes" placeholder="New notes"></textarea></div>
                </div>
                <div class="form-actions"><button type="submit" class="btn btn-primary">Update Item</button><button type="button" class="btn btn-secondary" (click)="resetUpdateForm()">Reset</button></div>
              </form>
            </div>
          </div>
          <div *ngIf="activeTab === 'delete'" class="tab-panel">
            <div class="form-container">
              <h2>Delete Item</h2>
              <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>
              <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
              <form (ngSubmit)="onDeleteItem()">
                <div class="form-group"><label>Item Name *</label><input type="text" [(ngModel)]="deleteForm.name" name="name" placeholder="Enter item name to delete" required></div>
                <div class="form-actions"><button type="submit" class="btn btn-danger">Delete Item</button><button type="button" class="btn btn-secondary" (click)="resetDeleteForm()">Reset</button></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="showConfirmModal" class="modal-overlay" (click)="cancelDelete()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header"><h3>Confirm Deletion</h3></div>
        <div class="modal-body"><p>Are you sure you want to delete <strong>"{{ deleteForm.name }}"</strong>?</p><p class="text-muted">This action cannot be undone.</p></div>
        <div class="modal-footer"><button class="btn btn-secondary" (click)="cancelDelete()">Cancel</button><button class="btn btn-danger" (click)="confirmDelete()">Delete</button></div>
      </div>
    </div>
  `,
  styles: [`
    .tab-nav { display: flex; gap: var(--spacing-xs); margin-bottom: var(--spacing-xl); background-color: var(--bg-secondary); padding: var(--spacing-sm); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); overflow-x: auto; flex-wrap: wrap; }
    .tab-btn { padding: var(--spacing-sm) var(--spacing-lg); background: none; border: none; border-radius: var(--border-radius); font-size: var(--font-sm); font-weight: 500; color: var(--text-secondary); cursor: pointer; transition: all var(--transition-fast); white-space: nowrap; }
    .tab-btn:hover { background-color: var(--bg-tertiary); color: var(--text-primary); }
    .tab-btn.active { background-color: var(--primary-color); color: white; }
    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); }
    .panel-header h2 { font-size: var(--font-xl); color: var(--text-primary); }
    .item-count { background-color: var(--bg-tertiary); padding: var(--spacing-xs) var(--spacing-md); border-radius: 20px; font-size: var(--font-sm); color: var(--text-secondary); }
    .inventory-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--spacing-lg); }
    .inventory-card { background-color: var(--bg-secondary); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); overflow: hidden; transition: all var(--transition-fast); }
    .inventory-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
    .card-header { display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md); background-color: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); }
    .item-name { font-size: var(--font-lg); font-weight: 600; color: var(--text-primary); }
    .card-body { padding: var(--spacing-md); }
    .card-id { font-size: var(--font-xs); color: var(--text-muted); margin-bottom: var(--spacing-md); }
    .card-details { display: flex; flex-direction: column; gap: var(--spacing-sm); }
    .detail-row { display: flex; justify-content: space-between; align-items: center; }
    .detail-label { font-size: var(--font-sm); color: var(--text-secondary); }
    .detail-value { font-size: var(--font-sm); font-weight: 500; color: var(--text-primary); }
    .detail-value.price { color: var(--primary-color); font-weight: 600; }
    .card-notes { margin-top: var(--spacing-md); padding: var(--spacing-sm); background-color: var(--bg-tertiary); border-radius: var(--border-radius); font-size: var(--font-sm); color: var(--text-secondary); }
    .form-container { background-color: var(--bg-secondary); border-radius: var(--border-radius-lg); padding: var(--spacing-xl); box-shadow: var(--shadow-md); max-width: 700px; margin: 0 auto; }
    .form-container h2 { font-size: var(--font-xl); margin-bottom: var(--spacing-sm); color: var(--text-primary); }
    .form-section { margin-bottom: var(--spacing-lg); padding-bottom: var(--spacing-lg); border-bottom: 1px solid var(--border-color); }
    .form-section:last-of-type { border-bottom: none; }
    .form-section h3 { font-size: var(--font-base); color: var(--text-secondary); margin-bottom: var(--spacing-md); }
    .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md); }
    .radio-group { display: flex; gap: var(--spacing-lg); flex-wrap: wrap; }
    .radio-label { display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer; font-size: var(--font-sm); }
    .radio-label input[type="radio"] { width: 18px; height: 18px; cursor: pointer; }
    .form-actions { display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid var(--border-color); }
    .badge-electronics { background-color: #d1fae5; color: #166534; }
    .badge-furniture { background-color: #fef3c7; color: #92400e; }
    .badge-clothing { background-color: #fce7f3; color: #9d174d; }
    .badge-tools { background-color: #dcfce7; color: #14532d; }
    .badge-miscellaneous { background-color: #f3f4f6; color: #374151; }
    @media (max-width: 768px) { .inventory-grid { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } .form-actions { flex-direction: column; } .form-actions .btn { width: 100%; } }
  `]
})
export class InventoryComponent implements OnInit {
  activeTab = 'list';
  items: InventoryItem[] = [];
  successMessage = '';
  errorMessage = '';
  showConfirmModal = false;
  categoryOptions = Object.values(Category);
  stockStatusOptions = Object.values(StockStatus);
  addForm: CreateInventoryItemDTO = this.getEmptyAddForm();
  updateForm: UpdateInventoryItemDTO & { currentName: string } = { currentName: '' };
  deleteForm: { name: string } = { name: '' };
  constructor(private inventoryService: InventoryService) {}
  ngOnInit(): void { this.loadItems(); }
  loadItems(): void { this.items = this.inventoryService.getAllItems(); }
  setTab(tab: string): void { this.activeTab = tab; this.clearMessages(); }
  clearMessages(): void { this.successMessage = ''; this.errorMessage = ''; }
  getEmptyAddForm(): CreateInventoryItemDTO { return { id: '', name: '', category: Category.Electronics, quantity: 0, price: 0, supplier: '', stockStatus: StockStatus.InStock, isPopular: false, notes: '' }; }
  onAddItem(): void {
    this.clearMessages();
    const result = this.inventoryService.createItem(this.addForm);
    if (result.success) { this.successMessage = `Successfully added item: ${result.data?.name}`; this.loadItems(); this.resetAddForm(); }
    else { this.errorMessage = result.error || 'Failed to add item'; }
  }
  resetAddForm(): void { this.addForm = this.getEmptyAddForm(); }
  onUpdateItem(): void {
    this.clearMessages();
    const updateData: UpdateInventoryItemDTO = {};
    if (this.updateForm.name) updateData.name = this.updateForm.name;
    if (this.updateForm.category) updateData.category = this.updateForm.category;
    if (this.updateForm.quantity !== undefined) updateData.quantity = this.updateForm.quantity;
    if (this.updateForm.price !== undefined) updateData.price = this.updateForm.price;
    if (this.updateForm.supplier) updateData.supplier = this.updateForm.supplier;
    if (this.updateForm.stockStatus) updateData.stockStatus = this.updateForm.stockStatus;
    if (this.updateForm.isPopular !== undefined && this.updateForm.isPopular !== null) updateData.isPopular = this.updateForm.isPopular;
    if (this.updateForm.notes !== undefined) updateData.notes = this.updateForm.notes;
    if (Object.keys(updateData).length === 0) { this.errorMessage = 'Please provide at least one field to update'; return; }
    const result = this.inventoryService.updateItem(this.updateForm.currentName, updateData);
    if (result.success) { this.successMessage = `Successfully updated item: ${result.data?.name}`; this.loadItems(); this.resetUpdateForm(); }
    else { this.errorMessage = result.error || 'Failed to update item'; }
  }
  resetUpdateForm(): void { this.updateForm = { currentName: '' }; }
  onDeleteItem(): void {
    if (!this.deleteForm.name.trim()) { this.errorMessage = 'Please enter an item name'; return; }
    this.showConfirmModal = true;
  }
  confirmDelete(): void {
    this.clearMessages();
    const result = this.inventoryService.deleteItem(this.deleteForm.name);
    this.showConfirmModal = false;
    if (result.success) { this.successMessage = `Successfully deleted item: ${result.data?.name}`; this.loadItems(); this.resetDeleteForm(); }
    else { this.errorMessage = result.error || 'Failed to delete item'; }
  }
  cancelDelete(): void { this.showConfirmModal = false; }
  resetDeleteForm(): void { this.deleteForm = { name: '' }; }
  getStatusBadgeClass(status: StockStatus): string {
    switch (status) { case StockStatus.InStock: return 'badge-success'; case StockStatus.LowStock: return 'badge-warning'; case StockStatus.OutOfStock: return 'badge-danger'; default: return 'badge-info'; }
  }
}

// ============================================================================
// SEARCH COMPONENT
// ============================================================================

@Component({
  selector: 'app-search',
  template: `
    <div class="search-page">
      <div class="page-header"><div class="container"><h1>Search &amp; Filter</h1><p>Find inventory items by name, category, stock status, or popularity</p></div></div>
      <div class="container">
        <div class="search-container">
          <div class="search-filters">
            <h2>Search Filters</h2>
            <div class="form-group"><label>Search by Name</label><input type="text" [(ngModel)]="filter.searchTerm" (keyup.enter)="performSearch()" placeholder="Enter item name..." class="search-input"></div>
            <div class="filter-row">
              <div class="form-group"><label>Category</label><select [(ngModel)]="filter.category"><option value="">All Categories</option><option *ngFor="let cat of categoryOptions" [value]="cat">{{ cat }}</option></select></div>
              <div class="form-group"><label>Stock Status</label><select [(ngModel)]="filter.stockStatus"><option value="">All Statuses</option><option *ngFor="let s of stockStatusOptions" [value]="s">{{ s }}</option></select></div>
              <div class="form-group checkbox-group"><label class="checkbox-wrapper"><input type="checkbox" [(ngModel)]="filter.showPopularOnly"><span>Popular Items Only</span></label></div>
            </div>
            <div class="search-actions">
              <button class="btn btn-primary" (click)="performSearch()"><span>&#128269;</span> Search</button>
              <button class="btn btn-secondary" (click)="showAll()"><span>&#128203;</span> Show All</button>
              <button class="btn btn-secondary" (click)="showPopular()"><span>&#11088;</span> Show Popular</button>
              <button class="btn btn-secondary" (click)="clearFilters()"><span>&#128260;</span> Clear Filters</button>
            </div>
          </div>
          <div class="search-results">
            <div class="results-header"><h2>Results</h2><span class="item-count">{{ results.length }} items found</span></div>
            <div *ngIf="results.length === 0" class="empty-state"><span class="icon">&#128269;</span><h3>No items found</h3><p>Try adjusting your search criteria</p></div>
            <div class="results-grid">
              <div *ngFor="let item of results" class="result-card">
                <div class="card-header"><span class="item-name">{{ item.name }}</span><span *ngIf="item.isPopular" class="badge badge-popular">&#11088; Popular</span></div>
                <div class="card-body">
                  <div class="card-id">{{ item.id }}</div>
                  <div class="card-details">
                    <div class="detail-row"><span class="detail-label">Category:</span><span class="badge" [ngClass]="'badge-' + item.category.toLowerCase()">{{ item.category }}</span></div>
                    <div class="detail-row"><span class="detail-label">Quantity:</span><span class="detail-value">{{ item.quantity }}</span></div>
                    <div class="detail-row"><span class="detail-label">Price:</span><span class="detail-value price">{{ item.price | currency }}</span></div>
                    <div class="detail-row"><span class="detail-label">Supplier:</span><span class="detail-value">{{ item.supplier }}</span></div>
                    <div class="detail-row"><span class="detail-label">Status:</span><span class="badge" [ngClass]="getStatusBadgeClass(item.stockStatus)">{{ item.stockStatus }}</span></div>
                  </div>
                  <div *ngIf="item.notes" class="card-notes"><strong>Notes:</strong> {{ item.notes }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container { background-color: var(--bg-secondary); border-radius: var(--border-radius-lg); padding: var(--spacing-xl); box-shadow: var(--shadow-md); margin-bottom: var(--spacing-xl); }
    .search-filters { margin-bottom: var(--spacing-xl); padding-bottom: var(--spacing-xl); border-bottom: 1px solid var(--border-color); }
    .search-filters h2 { font-size: var(--font-xl); margin-bottom: var(--spacing-lg); color: var(--text-primary); }
    .search-input { width: 100%; padding: var(--spacing-md); font-size: var(--font-base); }
    .filter-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--spacing-md); margin-top: var(--spacing-lg); }
    .checkbox-group { display: flex; align-items: flex-end; padding-bottom: var(--spacing-sm); }
    .checkbox-wrapper { display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer; font-size: var(--font-sm); }
    .checkbox-wrapper input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
    .search-actions { display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg); flex-wrap: wrap; }
    .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); }
    .results-header h2 { font-size: var(--font-xl); color: var(--text-primary); }
    .item-count { background-color: var(--bg-tertiary); padding: var(--spacing-xs) var(--spacing-md); border-radius: 20px; font-size: var(--font-sm); color: var(--text-secondary); }
    .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--spacing-lg); }
    .result-card { background-color: var(--bg-secondary); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); overflow: hidden; transition: all var(--transition-fast); }
    .result-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
    .card-header { display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md); background-color: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); }
    .item-name { font-size: var(--font-lg); font-weight: 600; color: var(--text-primary); }
    .card-body { padding: var(--spacing-md); }
    .card-id { font-size: var(--font-xs); color: var(--text-muted); margin-bottom: var(--spacing-md); }
    .card-details { display: flex; flex-direction: column; gap: var(--spacing-sm); }
    .detail-row { display: flex; justify-content: space-between; align-items: center; }
    .detail-label { font-size: var(--font-sm); color: var(--text-secondary); }
    .detail-value { font-size: var(--font-sm); font-weight: 500; color: var(--text-primary); }
    .detail-value.price { color: var(--primary-color); font-weight: 600; }
    .card-notes { margin-top: var(--spacing-md); padding: var(--spacing-sm); background-color: var(--bg-tertiary); border-radius: var(--border-radius); font-size: var(--font-sm); color: var(--text-secondary); }
    .badge-electronics { background-color: #d1fae5; color: #166534; }
    .badge-furniture { background-color: #fef3c7; color: #92400e; }
    .badge-clothing { background-color: #fce7f3; color: #9d174d; }
    .badge-tools { background-color: #dcfce7; color: #14532d; }
    .badge-miscellaneous { background-color: #f3f4f6; color: #374151; }
    @media (max-width: 768px) { .search-actions { flex-direction: column; } .search-actions .btn { width: 100%; } .results-grid { grid-template-columns: 1fr; } }
  `]
})
export class SearchComponent implements OnInit {
  results: InventoryItem[] = [];
  filter: InventoryFilter = {};
  categoryOptions = Object.values(Category);
  stockStatusOptions = Object.values(StockStatus);
  constructor(private inventoryService: InventoryService) {}
  ngOnInit(): void { this.results = this.inventoryService.getAllItems(); }
  performSearch(): void { this.results = this.inventoryService.filterItems(this.filter); }
  showAll(): void { this.clearFilters(); this.results = this.inventoryService.getAllItems(); }
  showPopular(): void { this.clearFilters(); this.results = this.inventoryService.getPopularItems(); }
  clearFilters(): void { this.filter = {}; }
  getStatusBadgeClass(status: StockStatus): string {
    switch (status) { case StockStatus.InStock: return 'badge-success'; case StockStatus.LowStock: return 'badge-warning'; case StockStatus.OutOfStock: return 'badge-danger'; default: return 'badge-info'; }
  }
}

// ============================================================================
// PRIVACY COMPONENT
// ============================================================================

@Component({
  selector: 'app-privacy',
  template: `
    <div class="privacy-page">
      <div class="page-header"><div class="container"><h1>Privacy &amp; Security Analysis</h1><p>Understanding the privacy and security considerations in our application</p></div></div>
      <div class="container">
        <div class="content-section">
          <h2>&#128274; Data Storage Security</h2>
          <div class="card">
            <div class="card-body">
              <h3>Client-Side Data Storage</h3>
              <p>Our inventory management system stores all data locally within the browser's memory using Angular services. This means data persists only during the browser session. When the browser is closed or the page is refreshed, data is reset to initial sample values.</p>
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
    .content-section { margin-bottom: var(--spacing-xl); }
    .content-section h2 { font-size: var(--font-xl); color: var(--text-primary); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm); }
    .card { background-color: var(--bg-secondary); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); overflow: hidden; }
    .card-body { padding: var(--spacing-xl); }
    .card-body h3 { font-size: var(--font-lg); color: var(--text-primary); margin-bottom: var(--spacing-md); }
    .card-body h4 { font-size: var(--font-base); color: var(--text-secondary); margin-top: var(--spacing-lg); margin-bottom: var(--spacing-sm); }
    .card-body p { color: var(--text-secondary); line-height: 1.8; margin-bottom: var(--spacing-md); }
    .card-body ul { list-style: none; padding: 0; }
    .card-body ul li { color: var(--text-secondary); padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative; line-height: 1.6; }
    .card-body ul li::before { content: "\u2022"; position: absolute; left: 0; color: var(--primary-color); font-weight: bold; }
    @media (max-width: 768px) { .content-section h2 { font-size: var(--font-lg); } }
  `]
})
export class PrivacyComponent {}

// ============================================================================
// HELP COMPONENT
// ============================================================================

@Component({
  selector: 'app-help',
  template: `
    <div class="help-page">
      <div class="page-header"><div class="container"><h1>Help &amp; FAQ</h1><p>Find answers to common questions and troubleshooting guidance</p></div></div>
      <div class="container">
        <section class="quick-start">
          <h2>&#128640; Quick Start Guide</h2>
          <div class="card"><div class="card-body">
            <h3>Getting Started</h3>
            <ol class="step-list">
              <li><strong>Home Page:</strong> The home page displays an overview of your inventory with statistics.</li>
              <li><strong>Navigate to Inventory:</strong> Click on "Inventory" in the navigation menu to manage items.</li>
              <li><strong>Use the Tabbed Interface:</strong> Switch between View All, Add, Update, and Delete tabs.</li>
              <li><strong>Search Items:</strong> Use the Search page to find items by name, category, or status.</li>
              <li><strong>Read Privacy Info:</strong> Visit the Privacy page to learn about data handling.</li>
            </ol>
          </div></div>
        </section>
        <section class="faq-section">
          <h2>&#10067; Frequently Asked Questions</h2>
          <div class="faq-item" *ngFor="let faq of faqs; let i = index">
            <button class="faq-question" (click)="toggleFaq(i)" [class.expanded]="expandedFaq === i">
              <span>{{ faq.question }}</span><span class="faq-icon">{{ expandedFaq === i ? '\u2212' : '+' }}</span>
            </button>
            <div class="faq-answer" [class.open]="expandedFaq === i"><p>{{ faq.answer }}</p></div>
          </div>
        </section>
        <section class="troubleshooting">
          <h2>&#128736; Troubleshooting</h2>
          <div class="card-grid">
            <div class="card"><div class="card-body"><h3>Cannot Add Item</h3><p><strong>Problem:</strong> Getting an error when trying to add an item.</p><p><strong>Solutions:</strong></p><ul><li>Make sure Item ID is 3-20 alphanumeric characters</li><li>Ensure Item ID is unique</li><li>Fill in all required fields marked with *</li><li>Quantity and Price must be 0 or positive numbers</li></ul></div></div>
            <div class="card"><div class="card-body"><h3>Cannot Find Item to Update</h3><p><strong>Problem:</strong> Item not found when updating.</p><p><strong>Solutions:</strong></p><ul><li>Check the spelling of the item name (case-insensitive)</li><li>View all items first to see the exact name</li><li>Use the Search page to find items</li></ul></div></div>
            <div class="card"><div class="card-body"><h3>Delete Confirmation Not Appearing</h3><p><strong>Problem:</strong> Delete doesn't show confirmation.</p><p><strong>Solution:</strong> Make sure you entered the exact item name before clicking Delete.</p></div></div>
          </div>
        </section>
        <section class="keyboard-shortcuts">
          <h2>&#9000; Navigation Tips</h2>
          <div class="card"><div class="card-body">
            <div class="shortcuts-grid">
              <div class="shortcut-item"><span class="shortcut-key">Home Page</span><span class="shortcut-desc">Click "Home" in the navigation bar</span></div>
              <div class="shortcut-item"><span class="shortcut-key">Inventory</span><span class="shortcut-desc">Click "Inventory" to manage items</span></div>
              <div class="shortcut-item"><span class="shortcut-key">Search</span><span class="shortcut-desc">Click "Search" to find items</span></div>
              <div class="shortcut-item"><span class="shortcut-key">Mobile Menu</span><span class="shortcut-desc">Click the hamburger icon on mobile</span></div>
            </div>
          </div></div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    section { margin-bottom: var(--spacing-xl); }
    section h2 { font-size: var(--font-xl); color: var(--text-primary); margin-bottom: var(--spacing-md); }
    .card { background-color: var(--bg-secondary); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); overflow: hidden; }
    .card-body { padding: var(--spacing-xl); }
    .card-body h3 { font-size: var(--font-lg); color: var(--text-primary); margin-bottom: var(--spacing-md); }
    .card-body p { color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--spacing-sm); }
    .card-body ul { list-style: disc; padding-left: var(--spacing-lg); color: var(--text-secondary); }
    .card-body ul li { margin-bottom: var(--spacing-xs); line-height: 1.6; }
    .step-list { list-style: none; padding: 0; counter-reset: step-counter; }
    .step-list li { counter-increment: step-counter; padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative; border-bottom: 1px solid var(--border-color); color: var(--text-secondary); line-height: 1.6; }
    .step-list li:last-child { border-bottom: none; }
    .step-list li::before { content: counter(step-counter); position: absolute; left: 0; width: 28px; height: 28px; background-color: var(--primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: var(--font-sm); }
    .faq-item { background-color: var(--bg-secondary); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); margin-bottom: var(--spacing-md); overflow: hidden; }
    .faq-question { width: 100%; padding: var(--spacing-lg); background: none; border: none; text-align: left; font-size: var(--font-base); font-weight: 500; color: var(--text-primary); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: var(--spacing-md); transition: background-color var(--transition-fast); }
    .faq-question:hover { background-color: var(--bg-tertiary); }
    .faq-question.expanded { background-color: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); }
    .faq-icon { font-size: var(--font-xl); color: var(--primary-color); font-weight: 300; }
    .faq-answer { max-height: 0; overflow: hidden; transition: max-height var(--transition-normal); }
    .faq-answer.open { max-height: 500px; }
    .faq-answer p { padding: var(--spacing-lg); color: var(--text-secondary); line-height: 1.7; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-lg); }
    .shortcuts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-md); }
    .shortcut-item { display: flex; flex-direction: column; gap: var(--spacing-xs); padding: var(--spacing-md); background-color: var(--bg-tertiary); border-radius: var(--border-radius); }
    .shortcut-key { font-weight: 600; color: var(--text-primary); font-size: var(--font-sm); }
    .shortcut-desc { color: var(--text-secondary); font-size: var(--font-sm); }
    @media (max-width: 768px) { section h2 { font-size: var(--font-lg); } .card-grid { grid-template-columns: 1fr; } }
  `]
})
export class HelpComponent {
  expandedFaq: number | null = null;
  faqs = [
    { question: 'How do I add a new inventory item?', answer: 'Navigate to the Inventory page, click the "Add Item" tab, fill in all required fields (Item ID, Name, Category, Quantity, Price, Supplier, Stock Status), and click "Add Item". Make sure the Item ID is unique and between 3-20 characters.' },
    { question: 'How do I update an existing item?', answer: 'Go to the Inventory page, click the "Update Item" tab. Enter the current item name in Step 1, then fill in only the fields you want to change in Step 2. Leave fields blank to keep their current values. Click "Update Item" to save.' },
    { question: 'How do I delete an item?', answer: 'Navigate to the Inventory page, click the "Delete Item" tab. Enter the exact item name and click "Delete Item". A confirmation dialog will appear - click "Delete" to confirm or "Cancel" to abort.' },
    { question: 'How does the search work?', answer: 'The Search page allows you to filter items by: (1) Name - type a search term, (2) Category - select a category, (3) Stock Status - filter by In Stock, Low Stock, or Out of Stock, (4) Popular - check the box to show only popular items. You can combine multiple filters.' }
  ];
  toggleFaq(index: number): void { this.expandedFaq = this.expandedFaq === index ? null : index; }
}

// ============================================================================
// APP COMPONENT (ROOT)
// ============================================================================

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'search', component: SearchComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: '' }
];

@Component({
  selector: 'app-root',
  template: `
    <div class="app-wrapper">
      <nav class="navbar">
        <div class="navbar-brand"><span class="brand-icon">&#128230;</span><span class="brand-text">Inventory System</span></div>
        <div class="navbar-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/inventory" routerLinkActive="active">Inventory</a>
          <a routerLink="/search" routerLinkActive="active">Search</a>
          <a routerLink="/privacy" routerLinkActive="active">Privacy</a>
          <a routerLink="/help" routerLinkActive="active">Help</a>
        </div>
        <button class="mobile-menu-btn" (click)="toggleMobileMenu()"><span></span><span></span><span></span></button>
      </nav>
      <div class="navbar-mobile" [class.open]="mobileMenuOpen">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobileMenu()">Home</a>
        <a routerLink="/inventory" routerLinkActive="active" (click)="closeMobileMenu()">Inventory</a>
        <a routerLink="/search" routerLinkActive="active" (click)="closeMobileMenu()">Search</a>
        <a routerLink="/privacy" routerLinkActive="active" (click)="closeMobileMenu()">Privacy</a>
        <a routerLink="/help" routerLinkActive="active" (click)="closeMobileMenu()">Help</a>
      </div>
      <main class="main-content"><router-outlet></router-outlet></main>
      <footer class="app-footer"><p>Inventory Management System - Part 2 | PROG2005 Programming Mobile Systems</p></footer>
    </div>
  `,
  styles: [`
    .app-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
    .navbar { background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); color: white; padding: 0 var(--spacing-lg); display: flex; align-items: center; justify-content: space-between; height: 60px; box-shadow: var(--shadow-md); position: sticky; top: 0; z-index: 100; }
    .navbar-brand { display: flex; align-items: center; gap: var(--spacing-sm); font-weight: 600; font-size: var(--font-lg); }
    .brand-icon { font-size: 1.5rem; }
    .navbar-links { display: flex; gap: var(--spacing-xs); }
    .navbar-links a { color: rgba(255, 255, 255, 0.85); padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--border-radius); font-size: var(--font-sm); font-weight: 500; transition: all var(--transition-fast); text-decoration: none; }
    .navbar-links a:hover { background-color: rgba(255, 255, 255, 0.15); color: white; }
    .navbar-links a.active { background-color: rgba(255, 255, 255, 0.2); color: white; }
    .mobile-menu-btn { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: var(--spacing-sm); }
    .mobile-menu-btn span { width: 24px; height: 2px; background-color: white; border-radius: 2px; transition: all var(--transition-fast); }
    .navbar-mobile { display: none; flex-direction: column; background-color: var(--primary-dark); padding: var(--spacing-md); gap: var(--spacing-xs); }
    .navbar-mobile.open { display: flex; }
    .navbar-mobile a { color: rgba(255, 255, 255, 0.85); padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--border-radius); font-size: var(--font-sm); font-weight: 500; text-decoration: none; }
    .navbar-mobile a.active, .navbar-mobile a:hover { background-color: rgba(255, 255, 255, 0.15); color: white; }
    .main-content { flex: 1; }
    .app-footer { background-color: var(--bg-secondary); border-top: 1px solid var(--border-color); padding: var(--spacing-lg); text-align: center; color: var(--text-muted); font-size: var(--font-sm); }
    @media (max-width: 768px) { .navbar-links { display: none; } .mobile-menu-btn { display: flex; } .navbar-brand .brand-text { display: none; } }
  `]
})
export class AppComponent {
  mobileMenuOpen = false;
  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }
  closeMobileMenu(): void { this.mobileMenuOpen = false; }
}
