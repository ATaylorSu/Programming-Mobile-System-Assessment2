/**
 * Data Models
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Part: Part 2 - Angular
 */

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
  isPopular?: boolean | null;
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
    id: 'SCU001',
    name: 'iPhone 17 Pro Max',
    category: Category.Electronics,
    quantity: 30,
    price: 1599.00,
    supplier: 'Apple Inc.',
    stockStatus: StockStatus.InStock,
    isPopular: true,
    notes: 'Latest flagship smartphone with A19 Pro chip'
  },
  {
    id: 'SCU002',
    name: 'Louis Vuitton Neverfull MM',
    category: Category.Miscellaneous,
    quantity: 5,
    price: 2030.00,
    supplier: 'Louis Vuitton',
    stockStatus: StockStatus.LowStock,
    isPopular: true,
    notes: 'Iconic monogram canvas tote bag'
  },
  {
    id: 'SCU003',
    name: 'Huawei MateBook X Pro',
    category: Category.Electronics,
    quantity: 12,
    price: 1499.00,
    supplier: 'Huawei Technologies',
    stockStatus: StockStatus.InStock,
    isPopular: false,
    notes: 'Ultra-slim 13th Gen Intel Core laptop'
  },
  {
    id: 'SCU004',
    name: 'Chanel N°5 Eau de Parfum',
    category: Category.Miscellaneous,
    quantity: 0,
    price: 185.00,
    supplier: 'Chanel',
    stockStatus: StockStatus.OutOfStock,
    isPopular: true,
    notes: 'Iconic floral fragrance, 100ml'
  },
  {
    id: 'SCU005',
    name: 'Estée Lauder Double Wear Foundation',
    category: Category.Miscellaneous,
    quantity: 48,
    price: 64.00,
    supplier: 'Estée Lauder Companies',
    stockStatus: StockStatus.InStock,
    isPopular: true,
    notes: '24-hour liquid foundation, multiple shades'
  }
];
