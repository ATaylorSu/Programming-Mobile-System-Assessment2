/**
 * Inventory Service Module
 * Handles all CRUD operations and business logic for inventory management
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Part: Part 1 - TypeScript
 */

import {
  InventoryItem,
  CreateInventoryItemDTO,
  UpdateInventoryItemDTO,
  InventoryFilter,
  OperationResult,
  Category,
  StockStatus,
  SAMPLE_INVENTORY_DATA
} from "./models.js";
import { Validator } from "./validation.js";

/**
 * Service class for managing inventory operations
 */
export class InventoryService {
  private inventory: InventoryItem[] = [];

  constructor() {
    this.initializeWithSampleData();
  }

  /**
   * Initialize service with sample data
   */
  private initializeWithSampleData(): void {
    const now = new Date();
    this.inventory = SAMPLE_INVENTORY_DATA.map((item) => ({
      ...item,
      createdAt: now,
      updatedAt: now
    }));
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `INV-${timestamp}-${randomStr}`.toUpperCase();
  }

  /**
   * Check if an ID already exists
   */
  private isIdExists(id: string): boolean {
    return this.inventory.some(
      (item) => item.id.toLowerCase() === id.toLowerCase()
    );
  }

  /**
   * Check if a name already exists
   */
  private isNameExists(name: string, excludeId?: string): boolean {
    return this.inventory.some(
      (item) =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.id !== excludeId
    );
  }

  /**
   * Get item by name (case-insensitive)
   */
  private getItemByName(name: string): InventoryItem | undefined {
    return this.inventory.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Create a new inventory item
   */
  createItem(data: unknown): OperationResult<InventoryItem> {
    const validation = Validator.validateCreateItem(data);

    if (!validation.success || !validation.data) {
      return { success: false, error: validation.error };
    }

    const itemData = validation.data;

    // Check for duplicate ID
    if (this.isIdExists(itemData.id)) {
      return {
        success: false,
        error: `An item with ID "${itemData.id}" already exists`
      };
    }

    // Create the item
    const now = new Date();
    const newItem: InventoryItem = {
      ...itemData,
      createdAt: now,
      updatedAt: now
    };

    this.inventory.push(newItem);
    return { success: true, data: newItem };
  }

  /**
   * Update an existing item by name
   */
  updateItem(name: string, data: unknown): OperationResult<InventoryItem> {
    // Validate the update data
    const validation = Validator.validateUpdateItem(data);

    if (!validation.success || !validation.data) {
      return { success: false, error: validation.error };
    }

    // Find the item by name
    const item = this.getItemByName(name);
    if (!item) {
      return {
        success: false,
        error: `Item with name "${name}" not found`
      };
    }

    // Check if new name conflicts with another item
    if (validation.data.name) {
      const nameExists = this.inventory.some(
        (i) =>
          i.id !== item.id &&
          i.name.toLowerCase() === validation.data!.name!.toLowerCase()
      );
      if (nameExists) {
        return {
          success: false,
          error: `Another item with name "${validation.data.name}" already exists`
        };
      }
    }

    // Apply updates
    const updatedItem: InventoryItem = {
      ...item,
      ...validation.data,
      id: item.id, // Prevent ID from being changed
      updatedAt: new Date()
    };

    // Update in array
    const index = this.inventory.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.inventory[index] = updatedItem;
    }

    return { success: true, data: updatedItem };
  }

  /**
   * Delete an item by name
   */
  deleteItem(name: string): OperationResult<InventoryItem> {
    const item = this.getItemByName(name);

    if (!item) {
      return {
        success: false,
        error: `Item with name "${name}" not found`
      };
    }

    const index = this.inventory.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.inventory.splice(index, 1);
    }

    return { success: true, data: item };
  }

  /**
   * Get all inventory items
   */
  getAllItems(): InventoryItem[] {
    return [...this.inventory];
  }

  /**
   * Get popular items only
   */
  getPopularItems(): InventoryItem[] {
    return this.inventory.filter((item) => item.isPopular);
  }

  /**
   * Search items by name (case-insensitive)
   */
  searchByName(searchTerm: string): InventoryItem[] {
    const term = Validator.validateSearchTerm(searchTerm);

    if (!term) {
      return this.getAllItems();
    }

    return this.inventory.filter((item) =>
      item.name.toLowerCase().includes(term)
    );
  }

  /**
   * Filter items by various criteria
   */
  filterItems(filter: InventoryFilter): InventoryItem[] {
    let results = [...this.inventory];

    // Filter by search term
    if (filter.searchTerm) {
      const term = Validator.validateSearchTerm(filter.searchTerm);
      if (term) {
        results = results.filter((item) =>
          item.name.toLowerCase().includes(term)
        );
      }
    }

    // Filter by category
    if (filter.category) {
      results = results.filter((item) => item.category === filter.category);
    }

    // Filter by stock status
    if (filter.stockStatus) {
      results = results.filter(
        (item) => item.stockStatus === filter.stockStatus
      );
    }

    // Filter by popular status
    if (filter.showPopularOnly) {
      results = results.filter((item) => item.isPopular);
    }

    return results;
  }

  /**
   * Get a single item by name
   */
  getItem(name: string): OperationResult<InventoryItem> {
    const item = this.getItemByName(name);

    if (!item) {
      return {
        success: false,
        error: `Item with name "${name}" not found`
      };
    }

    return { success: true, data: item };
  }

  /**
   * Get inventory statistics
   */
  getStatistics(): {
    totalItems: number;
    totalValue: number;
    popularCount: number;
    categoryCounts: Record<string, number>;
    stockStatusCounts: Record<string, number>;
  } {
    const categoryCounts: Record<string, number> = {};
    const stockStatusCounts: Record<string, number> = {};
    let totalValue = 0;
    let popularCount = 0;

    this.inventory.forEach((item) => {
      // Count categories
      categoryCounts[item.category] =
        (categoryCounts[item.category] || 0) + 1;

      // Count stock statuses
      stockStatusCounts[item.stockStatus] =
        (stockStatusCounts[item.stockStatus] || 0) + 1;

      // Calculate total value
      totalValue += item.price * item.quantity;

      // Count popular items
      if (item.isPopular) {
        popularCount++;
      }
    });

    return {
      totalItems: this.inventory.length,
      totalValue,
      popularCount,
      categoryCounts,
      stockStatusCounts
    };
  }

  /**
   * Bulk import items
   */
  bulkImport(items: unknown[]): OperationResult<{
    imported: number;
    failed: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let imported = 0;
    let failed = 0;

    for (let i = 0; i < items.length; i++) {
      const result = this.createItem(items[i]);
      if (result.success) {
        imported++;
      } else {
        failed++;
        errors.push(`Row ${i + 1}: ${result.error}`);
      }
    }

    return {
      success: failed === 0,
      data: { imported, failed, errors },
      error: failed > 0 ? `${failed} items failed to import` : undefined
    };
  }

  /**
   * Clear all inventory (use with caution)
   */
  clearAll(): void {
    this.inventory = [];
  }

  /**
   * Reset to sample data
   */
  resetToSampleData(): void {
    this.inventory = [];
    this.initializeWithSampleData();
  }
}
