/**
 * Inventory Service
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Part: Part 2 - Angular
 */

import { Injectable } from '@angular/core';
import {
  InventoryItem,
  CreateInventoryItemDTO,
  UpdateInventoryItemDTO,
  InventoryFilter,
  OperationResult,
  SAMPLE_INVENTORY_DATA
} from './models';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private inventory: InventoryItem[] = [];

  constructor() {
    this.initializeWithSampleData();
  }

  private initializeWithSampleData(): void {
    const now = new Date();
    this.inventory = SAMPLE_INVENTORY_DATA.map((item) => ({
      ...item,
      createdAt: now,
      updatedAt: now
    }));
  }

  private getItemByName(name: string): InventoryItem | undefined {
    return this.inventory.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
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
    if (data.quantity < 0) {
      return { success: false, error: 'Quantity cannot be negative' };
    }
    if (data.price < 0) {
      return { success: false, error: 'Price cannot be negative' };
    }

    const idExists = this.inventory.some(
      (item) => item.id.toLowerCase() === data.id.trim().toLowerCase()
    );
    if (idExists) {
      return { success: false, error: `An item with ID "${data.id}" already exists` };
    }

    const nameExists = this.inventory.some(
      (item) => item.name.toLowerCase() === data.name.trim().toLowerCase()
    );
    if (nameExists) {
      return { success: false, error: `An item with name "${data.name}" already exists` };
    }

    const now = new Date();
    const newItem: InventoryItem = {
      ...data,
      id: data.id.trim(),
      name: data.name.trim(),
      quantity: Number(data.quantity),
      price: Number(data.price),
      supplier: data.supplier.trim(),
      createdAt: now,
      updatedAt: now
    };

    this.inventory.push(newItem);
    return { success: true, data: newItem };
  }

  updateItem(name: string, data: UpdateInventoryItemDTO): OperationResult<InventoryItem> {
    const item = this.getItemByName(name);
    if (!item) {
      return { success: false, error: `Item with name "${name}" not found` };
    }

    if (data.name && data.name.trim() !== name) {
      const nameExists = this.inventory.some(
        (i) => i.id !== item.id && i.name.toLowerCase() === data.name!.trim().toLowerCase()
      );
      if (nameExists) {
        return { success: false, error: `Another item with name "${data.name}" already exists` };
      }
    }

    if (data.quantity !== undefined && data.quantity < 0) {
      return { success: false, error: 'Quantity cannot be negative' };
    }
    if (data.price !== undefined && data.price < 0) {
      return { success: false, error: 'Price cannot be negative' };
    }

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
    if (index !== -1) {
      this.inventory[index] = updatedItem;
    }

    return { success: true, data: updatedItem };
  }

  deleteItem(name: string): OperationResult<InventoryItem> {
    const item = this.getItemByName(name);
    if (!item) {
      return { success: false, error: `Item with name "${name}" not found` };
    }

    const index = this.inventory.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.inventory.splice(index, 1);
    }

    return { success: true, data: item };
  }

  getAllItems(): InventoryItem[] {
    return [...this.inventory];
  }

  getPopularItems(): InventoryItem[] {
    return this.inventory.filter((item) => item.isPopular);
  }

  filterItems(filter: InventoryFilter): InventoryItem[] {
    let results = [...this.inventory];

    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      results = results.filter((item) =>
        item.name.toLowerCase().includes(term)
      );
    }

    if (filter.category) {
      results = results.filter((item) => item.category === filter.category);
    }

    if (filter.stockStatus) {
      results = results.filter((item) => item.stockStatus === filter.stockStatus);
    }

    if (filter.showPopularOnly) {
      results = results.filter((item) => item.isPopular);
    }

    return results;
  }

  getStatistics(): { totalItems: number; totalValue: number; popularCount: number } {
    let totalValue = 0;
    let popularCount = 0;
    this.inventory.forEach((item) => {
      totalValue += item.price * item.quantity;
      if (item.isPopular) popularCount++;
    });
    return {
      totalItems: this.inventory.length,
      totalValue,
      popularCount
    };
  }
}
