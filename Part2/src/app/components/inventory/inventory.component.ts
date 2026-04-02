import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../inventory.service';
import {
  InventoryItem,
  Category,
  StockStatus,
  CreateInventoryItemDTO,
  UpdateInventoryItemDTO
} from '../../models';

@Component({
  selector: 'app-inventory',
  template: `
    <div class="inventory-page">
      <div class="page-header">
        <div class="container">
          <h1>Inventory Management</h1>
          <p>Add, edit, and delete inventory items</p>
        </div>
      </div>

      <div class="container">
        <div class="tab-nav">
          <button class="tab-btn" [class.active]="activeTab === 'list'" (click)="setTab('list')">
            📋 View All
          </button>
          <button class="tab-btn" [class.active]="activeTab === 'add'" (click)="setTab('add')">
            ➕ Add Item
          </button>
          <button class="tab-btn" [class.active]="activeTab === 'update'" (click)="setTab('update')">
            ✏️ Update Item
          </button>
          <button class="tab-btn" [class.active]="activeTab === 'delete'" (click)="setTab('delete')">
            🗑️ Delete Item
          </button>
        </div>

        <div class="tab-content">
          <!-- List View -->
          <div *ngIf="activeTab === 'list'" class="tab-panel">
            <div class="panel-header">
              <h2>All Inventory Items</h2>
              <span class="item-count">{{ items.length }} items</span>
            </div>

            <div *ngIf="items.length === 0" class="empty-state">
              <span class="icon">📦</span>
              <h3>No items found</h3>
              <p>Add some items to get started</p>
            </div>

            <div class="inventory-grid">
              <div *ngFor="let item of items" class="inventory-card">
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

          <!-- Add Item Form -->
          <div *ngIf="activeTab === 'add'" class="tab-panel">
            <div class="form-container">
              <h2>Add New Item</h2>
              <p class="form-desc">Fill in all required fields to add a new inventory item.</p>

              <div *ngIf="successMessage" class="alert alert-success">
                {{ successMessage }}
              </div>

              <div *ngIf="errorMessage" class="alert alert-error">
                {{ errorMessage }}
              </div>

              <form (ngSubmit)="onAddItem()">
                <div class="form-row">
                  <div class="form-group">
                    <label>Item ID *</label>
                    <input type="text" [(ngModel)]="addForm.id" name="id" placeholder="e.g., INV001" required>
                  </div>
                  <div class="form-group">
                    <label>Item Name *</label>
                    <input type="text" [(ngModel)]="addForm.name" name="name" placeholder="e.g., MacBook Pro" required>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Category *</label>
                    <select [(ngModel)]="addForm.category" name="category" required>
                      <option value="">Select Category</option>
                      <option *ngFor="let cat of categoryOptions" [value]="cat">{{ cat }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Stock Status *</label>
                    <select [(ngModel)]="addForm.stockStatus" name="stockStatus" required>
                      <option value="">Select Status</option>
                      <option *ngFor="let status of stockStatusOptions" [value]="status">{{ status }}</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Quantity *</label>
                    <input type="number" [(ngModel)]="addForm.quantity" name="quantity" min="0" placeholder="0" required>
                  </div>
                  <div class="form-group">
                    <label>Price (USD) *</label>
                    <input type="number" [(ngModel)]="addForm.price" name="price" min="0" step="0.01" placeholder="0.00" required>
                  </div>
                </div>

                <div class="form-group">
                  <label>Supplier *</label>
                  <input type="text" [(ngModel)]="addForm.supplier" name="supplier" placeholder="e.g., Apple Inc." required>
                </div>

                <div class="form-group">
                  <label>Popular Item</label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input type="radio" [(ngModel)]="addForm.isPopular" name="isPopular" [value]="true"> Yes
                    </label>
                    <label class="radio-label">
                      <input type="radio" [(ngModel)]="addForm.isPopular" name="isPopular" [value]="false"> No
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label>Notes</label>
                  <textarea [(ngModel)]="addForm.notes" name="notes" placeholder="Optional notes about this item..."></textarea>
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn btn-primary">Add Item</button>
                  <button type="button" class="btn btn-secondary" (click)="resetAddForm()">Reset</button>
                </div>
              </form>
            </div>
          </div>

          <!-- Update Item Form -->
          <div *ngIf="activeTab === 'update'" class="tab-panel">
            <div class="form-container">
              <h2>Update Item</h2>
              <p class="form-desc">Enter the current item name, then fill in the fields you want to update (leave blank to keep current values).</p>

              <div *ngIf="successMessage" class="alert alert-success">
                {{ successMessage }}
              </div>

              <div *ngIf="errorMessage" class="alert alert-error">
                {{ errorMessage }}
              </div>

              <form (ngSubmit)="onUpdateItem()">
                <div class="form-section">
                  <h3>Step 1: Find Item</h3>
                  <div class="form-group">
                    <label>Current Item Name *</label>
                    <input type="text" [(ngModel)]="updateForm.currentName" name="currentName" placeholder="Enter current item name" required>
                  </div>
                </div>

                <div class="form-section">
                  <h3>Step 2: Update Details (leave blank to keep current)</h3>

                  <div class="form-group">
                    <label>New Name</label>
                    <input type="text" [(ngModel)]="updateForm.name" name="name" placeholder="New item name">
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Category</label>
                      <select [(ngModel)]="updateForm.category" name="category">
                        <option value="">Keep Current</option>
                        <option *ngFor="let cat of categoryOptions" [value]="cat">{{ cat }}</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Stock Status</label>
                      <select [(ngModel)]="updateForm.stockStatus" name="stockStatus">
                        <option value="">Keep Current</option>
                        <option *ngFor="let status of stockStatusOptions" [value]="status">{{ status }}</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Quantity</label>
                      <input type="number" [(ngModel)]="updateForm.quantity" name="quantity" min="0" placeholder="New quantity">
                    </div>
                    <div class="form-group">
                      <label>Price (USD)</label>
                      <input type="number" [(ngModel)]="updateForm.price" name="price" min="0" step="0.01" placeholder="New price">
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Supplier</label>
                    <input type="text" [(ngModel)]="updateForm.supplier" name="supplier" placeholder="New supplier name">
                  </div>

                    <div class="form-group">
                      <label>Popular Item</label>
                      <div class="radio-group">
                        <label class="radio-label">
                          <input type="radio" [(ngModel)]="updateForm.isPopular" name="isPopular" [value]="true"> Yes
                        </label>
                        <label class="radio-label">
                          <input type="radio" [(ngModel)]="updateForm.isPopular" name="isPopular" [value]="false"> No
                        </label>
                        <label class="radio-label">
                          <input type="radio" [(ngModel)]="updateForm.isPopular" name="isPopular" [value]="null"> Keep Current
                        </label>
                      </div>
                    </div>

                  <div class="form-group">
                    <label>Notes</label>
                    <textarea [(ngModel)]="updateForm.notes" name="notes" placeholder="New notes"></textarea>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn btn-primary">Update Item</button>
                  <button type="button" class="btn btn-secondary" (click)="resetUpdateForm()">Reset</button>
                </div>
              </form>
            </div>
          </div>

          <!-- Delete Item Form -->
          <div *ngIf="activeTab === 'delete'" class="tab-panel">
            <div class="form-container">
              <h2>Delete Item</h2>
              <p class="form-desc">Enter the item name to delete. A confirmation dialog will appear before deletion.</p>

              <div *ngIf="successMessage" class="alert alert-success">
                {{ successMessage }}
              </div>

              <div *ngIf="errorMessage" class="alert alert-error">
                {{ errorMessage }}
              </div>

              <form (ngSubmit)="onDeleteItem()">
                <div class="form-group">
                  <label>Item Name *</label>
                  <input type="text" [(ngModel)]="deleteForm.name" name="name" placeholder="Enter item name to delete" required>
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn btn-danger">Delete Item</button>
                  <button type="button" class="btn btn-secondary" (click)="resetDeleteForm()">Reset</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div *ngIf="showConfirmModal" class="modal-overlay" (click)="cancelDelete()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Confirm Deletion</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>"{{ deleteForm.name }}"</strong>?</p>
          <p class="text-muted">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="cancelDelete()">Cancel</button>
          <button class="btn btn-danger" (click)="confirmDelete()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tab-nav {
      display: flex;
      gap: var(--spacing-xs);
      margin-bottom: var(--spacing-xl);
      background-color: var(--bg-secondary);
      padding: var(--spacing-sm);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      overflow-x: auto;
      flex-wrap: wrap;
    }

    .tab-btn {
      padding: var(--spacing-sm) var(--spacing-lg);
      background: none;
      border: none;
      border-radius: var(--border-radius);
      font-size: var(--font-sm);
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
    }

    .tab-btn:hover {
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
    }

    .tab-btn.active {
      background-color: var(--primary-color);
      color: white;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }

    .panel-header h2 {
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

    .inventory-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--spacing-lg);
    }

    .inventory-card {
      background-color: var(--bg-secondary);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      overflow: hidden;
      transition: all var(--transition-fast);
    }

    .inventory-card:hover {
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

    .form-container {
      background-color: var(--bg-secondary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
      max-width: 700px;
      margin: 0 auto;
    }

    .form-container h2 {
      font-size: var(--font-xl);
      margin-bottom: var(--spacing-sm);
      color: var(--text-primary);
    }

    .form-desc {
      color: var(--text-secondary);
      margin-bottom: var(--spacing-lg);
      font-size: var(--font-sm);
    }

    .form-section {
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-lg);
      border-bottom: 1px solid var(--border-color);
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-section h3 {
      font-size: var(--font-base);
      color: var(--text-secondary);
      margin-bottom: var(--spacing-md);
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
    }

    .radio-group {
      display: flex;
      gap: var(--spacing-lg);
      flex-wrap: wrap;
    }

    .radio-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      cursor: pointer;
      font-size: var(--font-sm);
    }

    .radio-label input[type="radio"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      margin-top: var(--spacing-lg);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--border-color);
    }

    .badge-electronics { background-color: #d1fae5; color: #166534; }
    .badge-furniture { background-color: #fef3c7; color: #92400e; }
    .badge-clothing { background-color: #fce7f3; color: #9d174d; }
    .badge-tools { background-color: #dcfce7; color: #14532d; }
    .badge-miscellaneous { background-color: #f3f4f6; color: #374151; }

    @media (max-width: 768px) {
      .tab-nav {
        justify-content: flex-start;
      }

      .inventory-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .form-actions .btn {
        width: 100%;
      }
    }
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

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.items = this.inventoryService.getAllItems();
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getEmptyAddForm(): CreateInventoryItemDTO {
    return {
      id: '',
      name: '',
      category: Category.Electronics,
      quantity: 0,
      price: 0,
      supplier: '',
      stockStatus: StockStatus.InStock,
      isPopular: false,
      notes: ''
    };
  }

  onAddItem(): void {
    this.clearMessages();
    const result = this.inventoryService.createItem(this.addForm);
    if (result.success) {
      this.successMessage = `Successfully added item: ${result.data?.name}`;
      this.loadItems();
      this.resetAddForm();
    } else {
      this.errorMessage = result.error || 'Failed to add item';
    }
  }

  resetAddForm(): void {
    this.addForm = this.getEmptyAddForm();
  }

  onUpdateItem(): void {
    this.clearMessages();
    const updateData: UpdateInventoryItemDTO = {};
    if (this.updateForm.name) updateData.name = this.updateForm.name;
    if (this.updateForm.category) updateData.category = this.updateForm.category;
    if (this.updateForm.quantity !== undefined) updateData.quantity = this.updateForm.quantity;
    if (this.updateForm.price !== undefined) updateData.price = this.updateForm.price;
    if (this.updateForm.supplier) updateData.supplier = this.updateForm.supplier;
    if (this.updateForm.stockStatus) updateData.stockStatus = this.updateForm.stockStatus;
    if (this.updateForm.isPopular !== undefined && this.updateForm.isPopular !== null) {
      updateData.isPopular = this.updateForm.isPopular;
    }
    if (this.updateForm.notes !== undefined) updateData.notes = this.updateForm.notes;

    if (Object.keys(updateData).length === 0) {
      this.errorMessage = 'Please provide at least one field to update';
      return;
    }

    const result = this.inventoryService.updateItem(this.updateForm.currentName, updateData);
    if (result.success) {
      this.successMessage = `Successfully updated item: ${result.data?.name}`;
      this.loadItems();
      this.resetUpdateForm();
    } else {
      this.errorMessage = result.error || 'Failed to update item';
    }
  }

  resetUpdateForm(): void {
    this.updateForm = { currentName: '' };
  }

  onDeleteItem(): void {
    if (!this.deleteForm.name.trim()) {
      this.errorMessage = 'Please enter an item name';
      return;
    }
    this.showConfirmModal = true;
  }

  confirmDelete(): void {
    this.clearMessages();
    const result = this.inventoryService.deleteItem(this.deleteForm.name);
    this.showConfirmModal = false;
    if (result.success) {
      this.successMessage = `Successfully deleted item: ${result.data?.name}`;
      this.loadItems();
      this.resetDeleteForm();
    } else {
      this.errorMessage = result.error || 'Failed to delete item';
    }
  }

  cancelDelete(): void {
    this.showConfirmModal = false;
  }

  resetDeleteForm(): void {
    this.deleteForm = { name: '' };
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
