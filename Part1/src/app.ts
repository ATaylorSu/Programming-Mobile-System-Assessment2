/**
 * Inventory Management System - Part 1
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Part: Part 1 - TypeScript
 */

// ============================================================================
// MODELS
// ============================================================================

export enum Category {
  Electronics = "Electronics",
  Furniture = "Furniture",
  Clothing = "Clothing",
  Tools = "Tools",
  Miscellaneous = "Miscellaneous"
}

export enum StockStatus {
  InStock = "In Stock",
  LowStock = "Low Stock",
  OutOfStock = "Out of Stock"
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
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
  isPopular?: boolean;
  notes?: string;
}

export interface InventoryFilter {
  searchTerm?: string;
  category?: Category;
  stockStatus?: StockStatus;
  showPopularOnly?: boolean;
}

export const SAMPLE_INVENTORY_DATA: CreateInventoryItemDTO[] = [
  {
    id: "SCU001",
    name: "iPhone 17 Pro Max",
    category: Category.Electronics,
    quantity: 30,
    price: 1599.00,
    supplier: "Apple Inc.",
    stockStatus: StockStatus.InStock,
    isPopular: true,
    notes: "Latest flagship smartphone with A19 Pro chip"
  },
  {
    id: "SCU002",
    name: "Louis Vuitton Neverfull MM",
    category: Category.Miscellaneous,
    quantity: 5,
    price: 2030.00,
    supplier: "Louis Vuitton",
    stockStatus: StockStatus.LowStock,
    isPopular: true,
    notes: "Iconic monogram canvas tote bag"
  },
  {
    id: "SCU003",
    name: "Huawei MateBook X Pro",
    category: Category.Electronics,
    quantity: 12,
    price: 1499.00,
    supplier: "Huawei Technologies",
    stockStatus: StockStatus.InStock,
    isPopular: false,
    notes: "Ultra-slim 13th Gen Intel Core laptop"
  },
  {
    id: "SCU004",
    name: "Chanel N\u00b05 Eau de Parfum",
    category: Category.Miscellaneous,
    quantity: 0,
    price: 185.00,
    supplier: "Chanel",
    stockStatus: StockStatus.OutOfStock,
    isPopular: true,
    notes: "Iconic floral fragrance, 100ml"
  },
  {
    id: "SCU005",
    name: "Est\u00e9e Lauder Double Wear Foundation",
    category: Category.Miscellaneous,
    quantity: 48,
    price: 64.00,
    supplier: "Est\u00e9e Lauder Companies",
    stockStatus: StockStatus.InStock,
    isPopular: true,
    notes: "24-hour liquid foundation, multiple shades"
  }
];

// ============================================================================
// VALIDATION
// ============================================================================

export class Validator {
  private static validateRequiredString(value: unknown, fieldName: string): ValidationError | null {
    if (value === null || value === undefined) {
      return { field: fieldName, message: `${fieldName} is required` };
    }
    if (typeof value !== "string" || value.trim() === "") {
      return { field: fieldName, message: `${fieldName} must be a non-empty string` };
    }
    return null;
  }

  private static validateNumber(value: unknown, fieldName: string, min?: number, max?: number, isInteger = false): ValidationError | null {
    if (value === null || value === undefined || value === "") {
      return { field: fieldName, message: `${fieldName} is required` };
    }
    const num = typeof value === "string" ? parseFloat(value) : (value as number);
    if (isNaN(num)) return { field: fieldName, message: `${fieldName} must be a valid number` };
    if (isInteger && !Number.isInteger(num)) return { field: fieldName, message: `${fieldName} must be a whole number` };
    if (min !== undefined && num < min) return { field: fieldName, message: `${fieldName} must be at least ${min}` };
    if (max !== undefined && num > max) return { field: fieldName, message: `${fieldName} must not exceed ${max}` };
    return null;
  }

  private static validateEnum(value: unknown, fieldName: string, validValues: readonly string[]): ValidationError | null {
    if (value === null || value === undefined || value === "") {
      return { field: fieldName, message: `${fieldName} is required` };
    }
    if (!validValues.includes(value as string)) {
      return { field: fieldName, message: `${fieldName} must be one of: ${validValues.join(", ")}` };
    }
    return null;
  }

  private static validateId(value: unknown): ValidationError | null {
    const error = this.validateRequiredString(value, "ID");
    if (error) return error;
    const idStr = String(value).trim();
    if (idStr.length < 3 || idStr.length > 20) return { field: "ID", message: "ID must be between 3 and 20 characters" };
    if (!/^[A-Za-z0-9_-]+$/.test(idStr)) return { field: "ID", message: "ID can only contain letters, numbers, hyphens, and underscores" };
    return null;
  }

  static validateCreateItem(data: unknown): OperationResult<CreateInventoryItemDTO> {
    const errors: ValidationError[] = [];
    if (!data || typeof data !== "object") return { success: false, error: "Invalid data format" };
    const item = data as Record<string, unknown>;
    let e = this.validateId(item.id); if (e) errors.push(e);
    e = this.validateRequiredString(item.name, "Name"); if (e) errors.push(e);
    e = this.validateEnum(item.category, "Category", Object.values(Category)); if (e) errors.push(e);
    e = this.validateNumber(item.quantity, "Quantity", 0, undefined, true); if (e) errors.push(e);
    e = this.validateNumber(item.price, "Price", 0, undefined, false); if (e) errors.push(e);
    e = this.validateRequiredString(item.supplier, "Supplier"); if (e) errors.push(e);
    e = this.validateEnum(item.stockStatus, "Stock Status", Object.values(StockStatus)); if (e) errors.push(e);
    if (item.isPopular === undefined || item.isPopular === null) errors.push({ field: "isPopular", message: "Popular status is required" });
    if (errors.length > 0) return { success: false, error: errors.map((x) => x.message).join("; ") };
    return {
      success: true,
      data: {
        id: String(item.id).trim(),
        name: String(item.name).trim(),
        category: item.category as Category,
        quantity: typeof item.quantity === "number" ? item.quantity : parseInt(String(item.quantity), 10),
        price: typeof item.price === "number" ? item.price : parseFloat(String(item.price)),
        supplier: String(item.supplier).trim(),
        stockStatus: item.stockStatus as StockStatus,
        isPopular: Boolean(item.isPopular),
        notes: item.notes ? String(item.notes).trim() : undefined
      }
    };
  }

  static validateUpdateItem(data: unknown): OperationResult<UpdateInventoryItemDTO> {
    const errors: ValidationError[] = [];
    if (!data || typeof data !== "object") return { success: false, error: "Invalid data format" };
    const item = data as Record<string, unknown>;
    const updateData: UpdateInventoryItemDTO = {};
    let e = this.validateRequiredString(item.name, "Name");
    if (e) errors.push(e); else updateData.name = String(item.name).trim();
    if (item.category !== undefined) { e = this.validateEnum(item.category, "Category", Object.values(Category)); if (e) errors.push(e); else updateData.category = item.category as Category; }
    if (item.quantity !== undefined) { e = this.validateNumber(item.quantity, "Quantity", 0, undefined, true); if (e) errors.push(e); else updateData.quantity = typeof item.quantity === "number" ? item.quantity : parseInt(String(item.quantity), 10); }
    if (item.price !== undefined) { e = this.validateNumber(item.price, "Price", 0, undefined, false); if (e) errors.push(e); else updateData.price = typeof item.price === "number" ? item.price : parseFloat(String(item.price)); }
    if (item.supplier !== undefined) { e = this.validateRequiredString(item.supplier, "Supplier"); if (e) errors.push(e); else updateData.supplier = String(item.supplier).trim(); }
    if (item.stockStatus !== undefined) { e = this.validateEnum(item.stockStatus, "Stock Status", Object.values(StockStatus)); if (e) errors.push(e); else updateData.stockStatus = item.stockStatus as StockStatus; }
    if (item.isPopular !== undefined) updateData.isPopular = Boolean(item.isPopular);
    if (item.notes !== undefined) updateData.notes = item.notes ? String(item.notes).trim() : undefined;
    if (errors.length > 0) return { success: false, error: errors.map((x) => x.message).join("; ") };
    if (Object.keys(updateData).length === 0) return { success: false, error: "At least one field must be provided for update" };
    return { success: true, data: updateData };
  }

  static validateSearchTerm(term: unknown): string {
    if (term === null || term === undefined) return "";
    return String(term).trim().toLowerCase();
  }

  static sanitizeString(input: string): string {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }
}

// ============================================================================
// SERVICE
// ============================================================================

export class InventoryService {
  private inventory: InventoryItem[] = [];

  constructor() { this.initializeWithSampleData(); }

  private initializeWithSampleData(): void {
    const now = new Date();
    this.inventory = SAMPLE_INVENTORY_DATA.map((item) => ({ ...item, createdAt: now, updatedAt: now }));
  }

  private getItemByName(name: string): InventoryItem | undefined {
    return this.inventory.find((item) => item.name.toLowerCase() === name.toLowerCase());
  }

  createItem(data: unknown): OperationResult<InventoryItem> {
    const validation = Validator.validateCreateItem(data);
    if (!validation.success || !validation.data) return { success: false, error: validation.error };
    const itemData = validation.data;
    if (this.inventory.some((item) => item.id.toLowerCase() === itemData.id.toLowerCase())) {
      return { success: false, error: `An item with ID "${itemData.id}" already exists` };
    }
    const now = new Date();
    const newItem: InventoryItem = { ...itemData, createdAt: now, updatedAt: now };
    this.inventory.push(newItem);
    return { success: true, data: newItem };
  }

  updateItem(name: string, data: unknown): OperationResult<InventoryItem> {
    const validation = Validator.validateUpdateItem(data);
    if (!validation.success || !validation.data) return { success: false, error: validation.error };
    const item = this.getItemByName(name);
    if (!item) return { success: false, error: `Item with name "${name}" not found` };
    if (validation.data.name) {
      const nameExists = this.inventory.some((i) => i.id !== item.id && i.name.toLowerCase() === validation.data!.name!.toLowerCase());
      if (nameExists) return { success: false, error: `Another item with name "${validation.data.name}" already exists` };
    }
    const updatedItem: InventoryItem = { ...item, ...validation.data, id: item.id, updatedAt: new Date() };
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
    if (filter.searchTerm) {
      const term = Validator.validateSearchTerm(filter.searchTerm);
      if (term) results = results.filter((item) => item.name.toLowerCase().includes(term));
    }
    if (filter.category) results = results.filter((item) => item.category === filter.category);
    if (filter.stockStatus) results = results.filter((item) => item.stockStatus === filter.stockStatus);
    if (filter.showPopularOnly) results = results.filter((item) => item.isPopular);
    return results;
  }

  getStatistics(): { totalItems: number; totalValue: number; popularCount: number; categoryCounts: Record<string, number>; stockStatusCounts: Record<string, number> } {
    const categoryCounts: Record<string, number> = {};
    const stockStatusCounts: Record<string, number> = {};
    let totalValue = 0, popularCount = 0;
    this.inventory.forEach((item) => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      stockStatusCounts[item.stockStatus] = (stockStatusCounts[item.stockStatus] || 0) + 1;
      totalValue += item.price * item.quantity;
      if (item.isPopular) popularCount++;
    });
    return { totalItems: this.inventory.length, totalValue, popularCount, categoryCounts, stockStatusCounts };
  }
}

// ============================================================================
// UI RENDERER
// ============================================================================

export class Formatter {
  static currency(value: number): string {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
  }
  static date(date: Date): string {
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(date));
  }
  static getCategoryClass(category: Category): string {
    const m: Record<Category, string> = { [Category.Electronics]: "category-electronics", [Category.Furniture]: "category-furniture", [Category.Clothing]: "category-clothing", [Category.Tools]: "category-tools", [Category.Miscellaneous]: "category-misc" };
    return m[category] || "category-misc";
  }
  static getStockStatusClass(status: StockStatus): string {
    const m: Record<StockStatus, string> = { [StockStatus.InStock]: "status-in-stock", [StockStatus.LowStock]: "status-low-stock", [StockStatus.OutOfStock]: "status-out-of-stock" };
    return m[status] || "";
  }
}

export class UIRenderer {
  private container: HTMLElement | null = null;
  constructor(containerId: string) { this.container = document.getElementById(containerId); }

  renderApp(): void {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="app-container">
        <header class="app-header"><h1>Inventory Management System</h1><p class="subtitle">Electronics Store</p></header>
        <nav class="nav-tabs">
          <button class="nav-tab active" data-view="list" onclick="app.switchView('list')"><span class="tab-icon">&#128203;</span><span class="tab-text">All Items</span></button>
          <button class="nav-tab" data-view="add" onclick="app.switchView('add')"><span class="tab-icon">&#10133;</span><span class="tab-text">Add Item</span></button>
          <button class="nav-tab" data-view="update" onclick="app.switchView('update')"><span class="tab-icon">&#9998;</span><span class="tab-text">Update Item</span></button>
          <button class="nav-tab" data-view="delete" onclick="app.switchView('delete')"><span class="tab-icon">&#128465;</span><span class="tab-text">Delete Item</span></button>
          <button class="nav-tab" data-view="search" onclick="app.switchView('search')"><span class="tab-icon">&#128269;</span><span class="tab-text">Search</span></button>
        </nav>
        <main class="main-content"><div id="notification-area" class="notification-area"></div><div id="content-area" class="content-area"></div></main>
        <footer class="app-footer"><p>Inventory Management System &copy; 2024</p></footer>
      </div>
      <div id="confirm-modal" class="modal hidden">
        <div class="modal-overlay" onclick="app.closeModal()"></div>
        <div class="modal-content">
          <div class="modal-header"><h3>Confirm Action</h3></div>
          <div class="modal-body"><p id="modal-message"></p></div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
            <button id="modal-confirm-btn" class="btn btn-danger">Confirm</button>
          </div>
        </div>
      </div>`;
  }

  renderListView(items: InventoryItem[]): void {
    const el = document.getElementById("content-area");
    if (!el) return;
    if (items.length === 0) {
      el.innerHTML = `<div class="empty-state"><span class="empty-icon">&#128230;</span><h3>No Items Found</h3><p>Your inventory is empty.</p></div>`;
      return;
    }
    el.innerHTML = `<div class="view-header"><h2>All Inventory Items</h2><span class="item-count">${items.length} item(s)</span></div><div class="inventory-grid">${items.map((item) => this.renderInventoryCard(item)).join("")}</div>`;
  }

  renderInventoryCard(item: InventoryItem): string {
    const cc = Formatter.getCategoryClass(item.category);
    const sc = Formatter.getStockStatusClass(item.stockStatus);
    return `<div class="inventory-card" data-id="${item.id}">
      <div class="card-header"><span class="badge ${cc}">${item.category}</span>${item.isPopular ? '<span class="badge badge-popular">Popular</span>' : ""}</div>
      <div class="card-body">
        <h3 class="item-name">${item.name}</h3><p class="item-id">ID: ${item.id}</p>
        <div class="item-details">
          <div class="detail-row"><span class="detail-label">Quantity:</span><span class="detail-value">${item.quantity}</span></div>
          <div class="detail-row"><span class="detail-label">Price:</span><span class="detail-value price">${Formatter.currency(item.price)}</span></div>
          <div class="detail-row"><span class="detail-label">Supplier:</span><span class="detail-value">${item.supplier}</span></div>
          <div class="detail-row"><span class="detail-label">Status:</span><span class="badge ${sc}">${item.stockStatus}</span></div>
        </div>${item.notes ? `<p class="item-notes"><strong>Notes:</strong> ${item.notes}</p>` : ""}
      </div>
      <div class="card-footer"><small class="text-muted">Updated: ${Formatter.date(item.updatedAt)}</small></div>
    </div>`;
  }

  renderAddForm(): void {
    const el = document.getElementById("content-area");
    if (!el) return;
    el.innerHTML = `<div class="form-container">
      <h2>Add New Item</h2>
      <form id="add-item-form" class="inventory-form">
        <div class="form-row">
          <div class="form-group"><label for="item-id">Item ID *</label><input type="text" id="item-id" name="id" placeholder="e.g., INV001" required></div>
          <div class="form-group"><label for="item-name">Item Name *</label><input type="text" id="item-name" name="name" placeholder="e.g., MacBook Pro" required></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label for="item-category">Category *</label><select id="item-category" name="category" required><option value="">Select Category</option>${Object.values(Category).map((c) => `<option value="${c}">${c}</option>`).join("")}</select></div>
          <div class="form-group"><label for="item-status">Stock Status *</label><select id="item-status" name="stockStatus" required><option value="">Select Status</option>${Object.values(StockStatus).map((s) => `<option value="${s}">${s}</option>`).join("")}</select></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label for="item-quantity">Quantity *</label><input type="number" id="item-quantity" name="quantity" min="0" placeholder="0" required></div>
          <div class="form-group"><label for="item-price">Price (USD) *</label><input type="number" id="item-price" name="price" min="0" step="0.01" placeholder="0.00" required></div>
        </div>
        <div class="form-group"><label for="item-supplier">Supplier *</label><input type="text" id="item-supplier" name="supplier" placeholder="e.g., Apple Inc." required></div>
        <div class="form-group"><label>Popular Item *</label><div class="radio-group"><label class="radio-label"><input type="radio" name="isPopular" value="true"> Yes</label><label class="radio-label"><input type="radio" name="isPopular" value="false" checked> No</label></div></div>
        <div class="form-group"><label for="item-notes">Notes (Optional)</label><textarea id="item-notes" name="notes" rows="3" placeholder="Additional information..."></textarea></div>
        <div class="form-actions"><button type="submit" class="btn btn-primary">Add Item</button><button type="reset" class="btn btn-secondary">Clear Form</button></div>
      </form>
    </div>`;
  }

  renderUpdateForm(): void {
    const el = document.getElementById("content-area");
    if (!el) return;
    el.innerHTML = `<div class="form-container">
      <h2>Update Item</h2>
      <form id="update-item-form" class="inventory-form">
        <div class="form-group"><label for="update-name">Item Name to Update *</label><input type="text" id="update-name" name="name" placeholder="Enter the current item name" required></div>
        <div class="update-section"><h3>New Values (leave blank to keep current)</h3></div>
        <div class="form-row">
          <div class="form-group"><label for="update-new-name">New Name</label><input type="text" id="update-new-name" name="newName" placeholder="New item name"></div>
          <div class="form-group"><label for="update-category">Category</label><select id="update-category" name="category"><option value="">Keep Current</option>${Object.values(Category).map((c) => `<option value="${c}">${c}</option>`).join("")}</select></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label for="update-quantity">Quantity</label><input type="number" id="update-quantity" name="quantity" min="0" placeholder="New quantity"></div>
          <div class="form-group"><label for="update-price">Price (USD)</label><input type="number" id="update-price" name="price" min="0" step="0.01" placeholder="New price"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label for="update-supplier">Supplier</label><input type="text" id="update-supplier" name="supplier" placeholder="New supplier"></div>
          <div class="form-group"><label for="update-status">Stock Status</label><select id="update-status" name="stockStatus"><option value="">Keep Current</option>${Object.values(StockStatus).map((s) => `<option value="${s}">${s}</option>`).join("")}</select></div>
        </div>
        <div class="form-group"><label>Popular Item</label><div class="radio-group"><label class="radio-label"><input type="radio" name="isPopular" value="true"> Yes</label><label class="radio-label"><input type="radio" name="isPopular" value="false"> No (keep current)</label></div></div>
        <div class="form-group"><label for="update-notes">Notes</label><textarea id="update-notes" name="notes" rows="3" placeholder="New notes"></textarea></div>
        <div class="form-actions"><button type="submit" class="btn btn-primary">Update Item</button><button type="reset" class="btn btn-secondary">Clear Form</button></div>
      </form>
    </div>`;
  }

  renderDeleteForm(): void {
    const el = document.getElementById("content-area");
    if (!el) return;
    el.innerHTML = `<div class="form-container">
      <h2>Delete Item</h2>
      <p class="form-description">Enter the name of the item you want to delete. This action cannot be undone.</p>
      <form id="delete-item-form" class="inventory-form">
        <div class="form-group"><label for="delete-name">Item Name *</label><input type="text" id="delete-name" name="name" placeholder="Enter item name to delete" required></div>
        <div class="form-actions"><button type="submit" class="btn btn-danger">Delete Item</button><button type="reset" class="btn btn-secondary">Clear</button></div>
      </form>
    </div>`;
  }

  renderSearchView(): void {
    const el = document.getElementById("content-area");
    if (!el) return;
    el.innerHTML = `<div class="search-container">
      <h2>Search &amp; Filter Inventory</h2>
      <div class="search-filters">
        <div class="form-group"><label for="search-term">Search by Name</label><input type="text" id="search-term" placeholder="Enter item name..."></div>
        <div class="filter-row">
          <div class="form-group"><label for="filter-category">Category</label><select id="filter-category"><option value="">All Categories</option>${Object.values(Category).map((c) => `<option value="${c}">${c}</option>`).join("")}</select></div>
          <div class="form-group"><label for="filter-status">Stock Status</label><select id="filter-status"><option value="">All Statuses</option>${Object.values(StockStatus).map((s) => `<option value="${s}">${s}</option>`).join("")}</select></div>
          <div class="form-group"><label>&nbsp;</label><div class="checkbox-wrapper"><input type="checkbox" id="filter-popular"><label for="filter-popular">Popular Items Only</label></div></div>
        </div>
        <div class="search-actions"><button id="btn-search" class="btn btn-primary">Search</button><button id="btn-show-all" class="btn btn-secondary">Show All</button><button id="btn-show-popular" class="btn btn-secondary">Show Popular</button></div>
      </div>
      <div id="search-results" class="search-results"><p class="placeholder-text">Enter a search term or select filters to find items.</p></div>
    </div>`;
  }

  renderSearchResults(items: InventoryItem[], performed = false): void {
    const el = document.getElementById("search-results");
    if (!el) return;
    if (!performed) { el.innerHTML = `<p class="placeholder-text">Enter a search term or select filters to find items.</p>`; return; }
    if (items.length === 0) { el.innerHTML = `<div class="empty-state"><span class="empty-icon">&#128269;</span><h3>No Results Found</h3><p>No items match your search criteria.</p></div>`; return; }
    el.innerHTML = `<div class="view-header"><h3>Search Results</h3><span class="item-count">${items.length} item(s) found</span></div><div class="inventory-grid">${items.map((item) => this.renderInventoryCard(item)).join("")}</div>`;
  }

  showNotification(message: string, type: "success" | "error" | "info" = "info"): void {
    const el = document.getElementById("notification-area");
    if (!el) return;
    const n = document.createElement("div");
    n.className = `notification notification-${type}`;
    n.innerHTML = `<span class="notification-icon">${type === "success" ? "&#10003;" : type === "error" ? "&#10007;" : "&#8505;"}</span><span class="notification-message">${message}</span><button class="notification-close" onclick="this.parentElement.remove()">&#215;</button>`;
    el.appendChild(n);
    setTimeout(() => { if (n.parentElement) n.remove(); }, 5000);
  }

  showConfirmModal(message: string, onConfirm: () => void): void {
    const modal = document.getElementById("confirm-modal");
    const msg = document.getElementById("modal-message");
    const btn = document.getElementById("modal-confirm-btn");
    if (!modal || !msg || !btn) return;
    msg.textContent = message;
    btn.onclick = () => { onConfirm(); this.closeModal(); };
    modal.classList.remove("hidden");
  }

  closeModal(): void {
    const modal = document.getElementById("confirm-modal");
    if (modal) modal.classList.add("hidden");
  }

  setActiveTab(viewName: string): void {
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.classList.remove("active");
      if (tab.getAttribute("data-view") === viewName) tab.classList.add("active");
    });
  }
}

// ============================================================================
// APPLICATION
// ============================================================================

class InventoryApp {
  private service: InventoryService;
  private renderer: UIRenderer;

  constructor() {
    this.service = new InventoryService();
    this.renderer = new UIRenderer("app");
    this.init();
  }

  private init(): void {
    this.renderer.renderApp();
    this.setupEventListeners();
    this.showListView();
    (window as unknown as { app: InventoryApp }).app = this;
  }

  private setupEventListeners(): void {
    document.addEventListener("submit", (e) => {
      const t = e.target as HTMLElement;
      if (t.id === "add-item-form") { e.preventDefault(); this.handleAdd(t as HTMLFormElement); }
      else if (t.id === "update-item-form") { e.preventDefault(); this.handleUpdate(t as HTMLFormElement); }
      else if (t.id === "delete-item-form") { e.preventDefault(); this.handleDelete(t as HTMLFormElement); }
    });
    document.addEventListener("click", (e) => {
      const t = e.target as HTMLElement;
      if (t.id === "btn-search") this.performSearch();
      else if (t.id === "btn-show-all") this.showListView();
      else if (t.id === "btn-show-popular") this.showPopularItems();
    });
    document.addEventListener("keypress", (e) => {
      const t = e.target as HTMLElement;
      if (e.key === "Enter" && t.id === "search-term") { e.preventDefault(); this.performSearch(); }
    });
  }

  switchView(view: string): void {
    this.renderer.setActiveTab(view);
    if (view === "list") this.showListView();
    else if (view === "add") this.renderer.renderAddForm();
    else if (view === "update") this.renderer.renderUpdateForm();
    else if (view === "delete") this.renderer.renderDeleteForm();
    else if (view === "search") this.renderer.renderSearchView();
    else this.showListView();
  }

  showListView(): void {
    this.renderer.renderListView(this.service.getAllItems());
    this.renderer.setActiveTab("list");
  }

  showPopularItems(): void {
    this.renderer.renderSearchView();
    setTimeout(() => { this.renderer.renderSearchResults(this.service.getPopularItems(), true); }, 0);
  }

  private handleAdd(form: HTMLFormElement): void {
    const fd = new FormData(form);
    const data: Record<string, unknown> = {};
    fd.forEach((value, key) => {
      if (key === "isPopular") data[key] = value === "true";
      else if (key === "quantity") data[key] = parseInt(value as string, 10);
      else if (key === "price") data[key] = parseFloat(value as string);
      else data[key] = value;
    });
    const r = this.service.createItem(data);
    if (r.success) { this.renderer.showNotification(`Successfully added item: ${r.data?.name}`, "success"); form.reset(); this.showListView(); }
    else { this.renderer.showNotification(r.error || "Failed to add item", "error"); }
  }

  private handleUpdate(form: HTMLFormElement): void {
    const fd = new FormData(form);
    const name = fd.get("name") as string;
    const data: Record<string, unknown> = {};
    fd.forEach((value, key) => {
      if (key === "name" || value === "") return;
      if (key === "isPopular") data[key] = value === "true";
      else if (key === "quantity") data[key] = parseInt(value as string, 10);
      else if (key === "price") data[key] = parseFloat(value as string);
      else if (key === "newName") data["name"] = value;
      else data[key] = value;
    });
    if (Object.keys(data).length === 0) { this.renderer.showNotification("Please provide at least one field to update", "error"); return; }
    const r = this.service.updateItem(name, data);
    if (r.success) { this.renderer.showNotification(`Successfully updated item: ${r.data?.name}`, "success"); form.reset(); this.showListView(); }
    else { this.renderer.showNotification(r.error || "Failed to update item", "error"); }
  }

  private handleDelete(form: HTMLFormElement): void {
    const fd = new FormData(form);
    const name = fd.get("name") as string;
    if (!name.trim()) { this.renderer.showNotification("Please enter an item name", "error"); return; }
    this.renderer.showConfirmModal(`Are you sure you want to delete "${name}"? This action cannot be undone.`, () => {
      const r = this.service.deleteItem(name);
      if (r.success) { this.renderer.showNotification(`Successfully deleted item: ${r.data?.name}`, "success"); form.reset(); this.showListView(); }
      else { this.renderer.showNotification(r.error || "Failed to delete item", "error"); }
    });
  }

  private performSearch(): void {
    const filter: InventoryFilter = {
      searchTerm: (document.getElementById("search-term") as HTMLInputElement)?.value || undefined,
      category: (document.getElementById("filter-category") as HTMLSelectElement)?.value as InventoryFilter["category"] || undefined,
      stockStatus: (document.getElementById("filter-status") as HTMLSelectElement)?.value as InventoryFilter["stockStatus"] || undefined,
      showPopularOnly: (document.getElementById("filter-popular") as HTMLInputElement)?.checked || undefined
    };
    this.renderer.renderSearchView();
    setTimeout(() => { this.renderer.renderSearchResults(this.service.filterItems(filter), true); }, 0);
  }

  closeModal(): void { this.renderer.closeModal(); }
}

document.addEventListener("DOMContentLoaded", () => { new InventoryApp(); });
if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(() => { if (!(window as unknown as { app?: InventoryApp }).app) new InventoryApp(); }, 0);
}
