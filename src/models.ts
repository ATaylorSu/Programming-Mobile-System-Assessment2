/**
 * Data Models for Inventory Management System
 * Defines TypeScript interfaces and types for inventory items
 */

// Category enumeration for inventory items
export enum Category {
  Electronics = "Electronics",
  Furniture = "Furniture",
  Clothing = "Clothing",
  Tools = "Tools",
  Miscellaneous = "Miscellaneous"
}

// Stock status enumeration
export enum StockStatus {
  InStock = "In Stock",
  LowStock = "Low Stock",
  OutOfStock = "Out of Stock"
}

// Interface for inventory item validation errors
export interface ValidationError {
  field: string;
  message: string;
}

// Result type for operations that can fail
export interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Interface for inventory item
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

// Interface for creating a new inventory item (without auto-generated fields)
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

// Interface for updating an inventory item
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

// Filter options for searching/filtering inventory
export interface InventoryFilter {
  searchTerm?: string;
  category?: Category;
  stockStatus?: StockStatus;
  showPopularOnly?: boolean;
}

// Sample data for demonstration
export const SAMPLE_INVENTORY_DATA: CreateInventoryItemDTO[] = [
  {
    id: "INV001",
    name: "MacBook Pro 14",
    category: Category.Electronics,
    quantity: 25,
    price: 1999.99,
    supplier: "Apple Inc.",
    stockStatus: StockStatus.InStock,
    isPopular: true,
    notes: "Latest M3 Pro chip model"
  },
  {
    id: "INV002",
    name: "Ergonomic Office Chair",
    category: Category.Furniture,
    quantity: 8,
    price: 349.99,
    supplier: "Herman Miller",
    stockStatus: StockStatus.LowStock,
    isPopular: false,
    notes: "High-end ergonomic chair"
  },
  {
    id: "INV003",
    name: "Winter Jacket",
    category: Category.Clothing,
    quantity: 0,
    price: 199.99,
    supplier: "North Face",
    stockStatus: StockStatus.OutOfStock,
    isPopular: true,
    notes: "Seasonal item - restocking next month"
  },
  {
    id: "INV004",
    name: "Power Drill Set",
    category: Category.Tools,
    quantity: 42,
    price: 129.99,
    supplier: "DeWalt",
    stockStatus: StockStatus.InStock,
    isPopular: true
  },
  {
    id: "INV005",
    name: "USB-C Hub",
    category: Category.Electronics,
    quantity: 150,
    price: 49.99,
    supplier: "Anker",
    stockStatus: StockStatus.InStock,
    isPopular: true,
    notes: "7-in-1 hub with HDMI"
  }
];
