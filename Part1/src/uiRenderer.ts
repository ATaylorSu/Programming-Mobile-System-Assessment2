/**
 * UI Renderer Module
 * Handles all DOM updates using innerHTML
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Part: Part 1 - TypeScript
 */

import { InventoryItem, Category, StockStatus } from "./models.js";

/**
 * Utility functions for formatting
 */
export class Formatter {
  /**
   * Format currency
   */
  static currency(value: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(value);
  }

  /**
   * Format date
   */
  static date(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(date));
  }

  /**
   * Get category display class
   */
  static getCategoryClass(category: Category): string {
    const classMap: Record<Category, string> = {
      [Category.Electronics]: "category-electronics",
      [Category.Furniture]: "category-furniture",
      [Category.Clothing]: "category-clothing",
      [Category.Tools]: "category-tools",
      [Category.Miscellaneous]: "category-misc"
    };
    return classMap[category] || "category-misc";
  }

  /**
   * Get stock status class
   */
  static getStockStatusClass(status: StockStatus): string {
    const classMap: Record<StockStatus, string> = {
      [StockStatus.InStock]: "status-in-stock",
      [StockStatus.LowStock]: "status-low-stock",
      [StockStatus.OutOfStock]: "status-out-of-stock"
    };
    return classMap[status] || "";
  }
}

/**
 * UI Renderer class for managing the interface
 */
export class UIRenderer {
  private container: HTMLElement | null = null;
  private currentView: "list" | "form" | "search" = "list";

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
  }

  /**
   * Render the main application layout
   */
  renderApp(): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="app-container">
        <header class="app-header">
          <h1>Inventory Management System</h1>
          <p class="subtitle">Electronics Store</p>
        </header>

        <nav class="nav-tabs">
          <button class="nav-tab active" data-view="list" onclick="app.switchView('list')">
            <span class="tab-icon">📋</span>
            <span class="tab-text">All Items</span>
          </button>
          <button class="nav-tab" data-view="add" onclick="app.switchView('add')">
            <span class="tab-icon">➕</span>
            <span class="tab-text">Add Item</span>
          </button>
          <button class="nav-tab" data-view="update" onclick="app.switchView('update')">
            <span class="tab-icon">✏️</span>
            <span class="tab-text">Update Item</span>
          </button>
          <button class="nav-tab" data-view="delete" onclick="app.switchView('delete')">
            <span class="tab-icon">🗑️</span>
            <span class="tab-text">Delete Item</span>
          </button>
          <button class="nav-tab" data-view="search" onclick="app.switchView('search')">
            <span class="tab-icon">🔍</span>
            <span class="tab-text">Search</span>
          </button>
        </nav>

        <main class="main-content">
          <div id="notification-area" class="notification-area"></div>
          <div id="content-area" class="content-area"></div>
        </main>

        <footer class="app-footer">
          <p>Inventory Management System &copy; 2024</p>
        </footer>
      </div>

      <!-- Confirmation Modal -->
      <div id="confirm-modal" class="modal hidden">
        <div class="modal-overlay" onclick="app.closeModal()"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3>Confirm Action</h3>
          </div>
          <div class="modal-body">
            <p id="modal-message"></p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
            <button id="modal-confirm-btn" class="btn btn-danger">Confirm</button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render inventory list view
   */
  renderListView(items: InventoryItem[]): void {
    const contentArea = document.getElementById("content-area");
    if (!contentArea) return;

    if (items.length === 0) {
      contentArea.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📦</span>
          <h3>No Items Found</h3>
          <p>Your inventory is empty. Add some items to get started.</p>
        </div>
      `;
      return;
    }

    contentArea.innerHTML = `
      <div class="view-header">
        <h2>All Inventory Items</h2>
        <span class="item-count">${items.length} item(s)</span>
      </div>
      <div class="inventory-grid">
        ${items.map((item) => this.renderInventoryCard(item)).join("")}
      </div>
    `;
  }

  /**
   * Render a single inventory card
   */
  renderInventoryCard(item: InventoryItem): string {
    const categoryClass = Formatter.getCategoryClass(item.category);
    const statusClass = Formatter.getStockStatusClass(item.stockStatus);

    return `
      <div class="inventory-card" data-id="${item.id}">
        <div class="card-header">
          <span class="badge ${categoryClass}">${item.category}</span>
          ${item.isPopular ? '<span class="badge badge-popular">Popular</span>' : ""}
        </div>
        <div class="card-body">
          <h3 class="item-name">${item.name}</h3>
          <p class="item-id">ID: ${item.id}</p>
          <div class="item-details">
            <div class="detail-row">
              <span class="detail-label">Quantity:</span>
              <span class="detail-value">${item.quantity}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Price:</span>
              <span class="detail-value price">${Formatter.currency(item.price)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Supplier:</span>
              <span class="detail-value">${item.supplier}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="badge ${statusClass}">${item.stockStatus}</span>
            </div>
          </div>
          ${item.notes ? `<p class="item-notes"><strong>Notes:</strong> ${item.notes}</p>` : ""}
        </div>
        <div class="card-footer">
          <small class="text-muted">Updated: ${Formatter.date(item.updatedAt)}</small>
        </div>
      </div>
    `;
  }

  /**
   * Render add item form
   */
  renderAddForm(): void {
    const contentArea = document.getElementById("content-area");
    if (!contentArea) return;

    contentArea.innerHTML = `
      <div class="form-container">
        <h2>Add New Item</h2>
        <form id="add-item-form" class="inventory-form">
          <div class="form-row">
            <div class="form-group">
              <label for="item-id">Item ID *</label>
              <input type="text" id="item-id" name="id" placeholder="e.g., INV001" required>
            </div>
            <div class="form-group">
              <label for="item-name">Item Name *</label>
              <input type="text" id="item-name" name="name" placeholder="e.g., MacBook Pro" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="item-category">Category *</label>
              <select id="item-category" name="category" required>
                <option value="">Select Category</option>
                ${Object.values(Category)
                  .map((cat) => `<option value="${cat}">${cat}</option>`)
                  .join("")}
              </select>
            </div>
            <div class="form-group">
              <label for="item-status">Stock Status *</label>
              <select id="item-status" name="stockStatus" required>
                <option value="">Select Status</option>
                ${Object.values(StockStatus)
                  .map((status) => `<option value="${status}">${status}</option>`)
                  .join("")}
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="item-quantity">Quantity *</label>
              <input type="number" id="item-quantity" name="quantity" min="0" placeholder="0" required>
            </div>
            <div class="form-group">
              <label for="item-price">Price (USD) *</label>
              <input type="number" id="item-price" name="price" min="0" step="0.01" placeholder="0.00" required>
            </div>
          </div>

          <div class="form-group">
            <label for="item-supplier">Supplier *</label>
            <input type="text" id="item-supplier" name="supplier" placeholder="e.g., Apple Inc." required>
          </div>

          <div class="form-group">
            <label for="item-popular">Popular Item *</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" name="isPopular" value="true"> Yes
              </label>
              <label class="radio-label">
                <input type="radio" name="isPopular" value="false" checked> No
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="item-notes">Notes (Optional)</label>
            <textarea id="item-notes" name="notes" rows="3" placeholder="Additional information..."></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Add Item</button>
            <button type="reset" class="btn btn-secondary">Clear Form</button>
          </div>
        </form>
      </div>
    `;
  }

  /**
   * Render update item form
   */
  renderUpdateForm(): void {
    const contentArea = document.getElementById("content-area");
    if (!contentArea) return;

    contentArea.innerHTML = `
      <div class="form-container">
        <h2>Update Item</h2>
        <form id="update-item-form" class="inventory-form">
          <div class="form-group">
            <label for="update-name">Item Name to Update *</label>
            <input type="text" id="update-name" name="name" placeholder="Enter the current item name" required>
          </div>

          <div class="update-section">
            <h3>New Values (leave blank to keep current)</h3>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="update-new-name">New Name</label>
              <input type="text" id="update-new-name" name="newName" placeholder="New item name">
            </div>
            <div class="form-group">
              <label for="update-category">Category</label>
              <select id="update-category" name="category">
                <option value="">Keep Current</option>
                ${Object.values(Category)
                  .map((cat) => `<option value="${cat}">${cat}</option>`)
                  .join("")}
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="update-quantity">Quantity</label>
              <input type="number" id="update-quantity" name="quantity" min="0" placeholder="New quantity">
            </div>
            <div class="form-group">
              <label for="update-price">Price (USD)</label>
              <input type="number" id="update-price" name="price" min="0" step="0.01" placeholder="New price">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="update-supplier">Supplier</label>
              <input type="text" id="update-supplier" name="supplier" placeholder="New supplier">
            </div>
            <div class="form-group">
              <label for="update-status">Stock Status</label>
              <select id="update-status" name="stockStatus">
                <option value="">Keep Current</option>
                ${Object.values(StockStatus)
                  .map((status) => `<option value="${status}">${status}</option>`)
                  .join("")}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="update-popular">Popular Item</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" name="isPopular" value="true"> Yes
              </label>
              <label class="radio-label">
                <input type="radio" name="isPopular" value="false"> No (keep current)
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="update-notes">Notes</label>
            <textarea id="update-notes" name="notes" rows="3" placeholder="New notes"></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Update Item</button>
            <button type="reset" class="btn btn-secondary">Clear Form</button>
          </div>
        </form>
      </div>
    `;
  }

  /**
   * Render delete item form
   */
  renderDeleteForm(): void {
    const contentArea = document.getElementById("content-area");
    if (!contentArea) return;

    contentArea.innerHTML = `
      <div class="form-container">
        <h2>Delete Item</h2>
        <p class="form-description">Enter the name of the item you want to delete. This action cannot be undone.</p>
        <form id="delete-item-form" class="inventory-form">
          <div class="form-group">
            <label for="delete-name">Item Name *</label>
            <input type="text" id="delete-name" name="name" placeholder="Enter item name to delete" required>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-danger">Delete Item</button>
            <button type="reset" class="btn btn-secondary">Clear</button>
          </div>
        </form>
      </div>
    `;
  }

  /**
   * Render search view
   */
  renderSearchView(): void {
    const contentArea = document.getElementById("content-area");
    if (!contentArea) return;

    contentArea.innerHTML = `
      <div class="search-container">
        <h2>Search & Filter Inventory</h2>

        <div class="search-filters">
          <div class="form-group">
            <label for="search-term">Search by Name</label>
            <input type="text" id="search-term" placeholder="Enter item name...">
          </div>

          <div class="filter-row">
            <div class="form-group">
              <label for="filter-category">Category</label>
              <select id="filter-category">
                <option value="">All Categories</option>
                ${Object.values(Category)
                  .map((cat) => `<option value="${cat}">${cat}</option>`)
                  .join("")}
              </select>
            </div>

            <div class="form-group">
              <label for="filter-status">Stock Status</label>
              <select id="filter-status">
                <option value="">All Statuses</option>
                ${Object.values(StockStatus)
                  .map((status) => `<option value="${status}">${status}</option>`)
                  .join("")}
              </select>
            </div>

            <div class="form-group">
              <label>&nbsp;</label>
              <div class="checkbox-wrapper">
                <input type="checkbox" id="filter-popular">
                <label for="filter-popular">Popular Items Only</label>
              </div>
            </div>
          </div>

          <div class="search-actions">
            <button id="btn-search" class="btn btn-primary">Search</button>
            <button id="btn-show-all" class="btn btn-secondary">Show All</button>
            <button id="btn-show-popular" class="btn btn-secondary">Show Popular</button>
          </div>
        </div>

        <div id="search-results" class="search-results">
          <p class="placeholder-text">Enter a search term or select filters to find items.</p>
        </div>
      </div>
    `;
  }

  /**
   * Render search results
   */
  renderSearchResults(items: InventoryItem[], searchPerformed: boolean = false): void {
    const resultsArea = document.getElementById("search-results");
    if (!resultsArea) return;

    if (!searchPerformed) {
      resultsArea.innerHTML = `<p class="placeholder-text">Enter a search term or select filters to find items.</p>`;
      return;
    }

    if (items.length === 0) {
      resultsArea.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🔍</span>
          <h3>No Results Found</h3>
          <p>No items match your search criteria.</p>
        </div>
      `;
      return;
    }

    resultsArea.innerHTML = `
      <div class="view-header">
        <h3>Search Results</h3>
        <span class="item-count">${items.length} item(s) found</span>
      </div>
      <div class="inventory-grid">
        ${items.map((item) => this.renderInventoryCard(item)).join("")}
      </div>
    `;
  }

  /**
   * Show notification message
   */
  showNotification(message: string, type: "success" | "error" | "info" = "info"): void {
    const notificationArea = document.getElementById("notification-area");
    if (!notificationArea) return;

    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span class="notification-icon">${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

    notificationArea.appendChild(notification);

    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  /**
   * Show confirmation modal
   */
  showConfirmModal(message: string, onConfirm: () => void): void {
    const modal = document.getElementById("confirm-modal");
    const messageEl = document.getElementById("modal-message");
    const confirmBtn = document.getElementById("modal-confirm-btn");

    if (!modal || !messageEl || !confirmBtn) return;

    messageEl.textContent = message;
    confirmBtn.onclick = () => {
      onConfirm();
      this.closeModal();
    };

    modal.classList.remove("hidden");
  }

  /**
   * Close modal
   */
  closeModal(): void {
    const modal = document.getElementById("confirm-modal");
    if (modal) {
      modal.classList.add("hidden");
    }
  }

  /**
   * Update active tab
   */
  setActiveTab(viewName: string): void {
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.classList.remove("active");
      if (tab.getAttribute("data-view") === viewName) {
        tab.classList.add("active");
      }
    });
  }
}
