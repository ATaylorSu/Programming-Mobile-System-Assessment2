/**
 * Validation Module for Inventory Management System
 * Handles input validation and sanitization
 */

import {
  InventoryItem,
  CreateInventoryItemDTO,
  UpdateInventoryItemDTO,
  ValidationError,
  Category,
  StockStatus,
  OperationResult
} from "./models.js";

/**
 * Validator class for inventory-related operations
 */
export class Validator {
  /**
   * Validates required string fields
   */
  private static validateRequiredString(
    value: unknown,
    fieldName: string
  ): ValidationError | null {
    if (value === null || value === undefined) {
      return {
        field: fieldName,
        message: `${fieldName} is required`
      };
    }
    if (typeof value !== "string" || value.trim() === "") {
      return {
        field: fieldName,
        message: `${fieldName} must be a non-empty string`
      };
    }
    return null;
  }

  /**
   * Validates numeric fields
   */
  private static validateNumber(
    value: unknown,
    fieldName: string,
    min?: number,
    max?: number,
    isInteger: boolean = false
  ): ValidationError | null {
    if (value === null || value === undefined || value === "") {
      return {
        field: fieldName,
        message: `${fieldName} is required`
      };
    }

    const num = typeof value === "string" ? parseFloat(value) : (value as number);

    if (isNaN(num)) {
      return {
        field: fieldName,
        message: `${fieldName} must be a valid number`
      };
    }

    if (isInteger && !Number.isInteger(num)) {
      return {
        field: fieldName,
        message: `${fieldName} must be a whole number`
      };
    }

    if (min !== undefined && num < min) {
      return {
        field: fieldName,
        message: `${fieldName} must be at least ${min}`
      };
    }

    if (max !== undefined && num > max) {
      return {
        field: fieldName,
        message: `${fieldName} must not exceed ${max}`
      };
    }

    return null;
  }

  /**
   * Validates enum values
   */
  private static validateEnum<T extends string>(
    value: unknown,
    fieldName: string,
    validValues: readonly string[]
  ): ValidationError | null {
    if (value === null || value === undefined || value === "") {
      return {
        field: fieldName,
        message: `${fieldName} is required`
      };
    }

    if (!validValues.includes(value as string)) {
      return {
        field: fieldName,
        message: `${fieldName} must be one of: ${validValues.join(", ")}`
      };
    }

    return null;
  }

  /**
   * Validates unique ID format
   */
  private static validateId(value: unknown): ValidationError | null {
    const error = this.validateRequiredString(value, "ID");
    if (error) return error;

    const idStr = String(value).trim();
    if (idStr.length < 3 || idStr.length > 20) {
      return {
        field: "ID",
        message: "ID must be between 3 and 20 characters"
      };
    }

    if (!/^[A-Za-z0-9_-]+$/.test(idStr)) {
      return {
        field: "ID",
        message: "ID can only contain letters, numbers, hyphens, and underscores"
      };
    }

    return null;
  }

  /**
   * Validates form data for creating a new inventory item
   */
  static validateCreateItem(data: unknown): OperationResult<CreateInventoryItemDTO> {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== "object") {
      return {
        success: false,
        error: "Invalid data format"
      };
    }

    const item = data as Record<string, unknown>;

    // Validate ID
    const idError = this.validateId(item.id);
    if (idError) errors.push(idError);

    // Validate name
    const nameError = this.validateRequiredString(item.name, "Name");
    if (nameError) errors.push(nameError);

    // Validate category
    const categoryError = this.validateEnum(
      item.category,
      "Category",
      Object.values(Category)
    );
    if (categoryError) errors.push(categoryError);

    // Validate quantity
    const quantityError = this.validateNumber(
      item.quantity,
      "Quantity",
      0,
      undefined,
      true
    );
    if (quantityError) errors.push(quantityError);

    // Validate price
    const priceError = this.validateNumber(
      item.price,
      "Price",
      0,
      undefined,
      false
    );
    if (priceError) errors.push(priceError);

    // Validate supplier
    const supplierError = this.validateRequiredString(item.supplier, "Supplier");
    if (supplierError) errors.push(supplierError);

    // Validate stock status
    const statusError = this.validateEnum(
      item.stockStatus,
      "Stock Status",
      Object.values(StockStatus)
    );
    if (statusError) errors.push(statusError);

    // Validate isPopular
    if (item.isPopular === undefined || item.isPopular === null) {
      errors.push({
        field: "isPopular",
        message: "Popular status is required"
      });
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: errors.map((e) => e.message).join("; ")
      };
    }

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

  /**
   * Validates form data for updating an existing inventory item
   */
  static validateUpdateItem(data: unknown): OperationResult<UpdateInventoryItemDTO> {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== "object") {
      return {
        success: false,
        error: "Invalid data format"
      };
    }

    const item = data as Record<string, unknown>;
    const updateData: UpdateInventoryItemDTO = {};

    // Name is required for update (used as identifier)
    if (item.name !== undefined) {
      const nameError = this.validateRequiredString(item.name, "Name");
      if (nameError) {
        errors.push(nameError);
      } else {
        updateData.name = String(item.name).trim();
      }
    }

    // Validate optional fields if provided
    if (item.category !== undefined) {
      const categoryError = this.validateEnum(
        item.category,
        "Category",
        Object.values(Category)
      );
      if (categoryError) {
        errors.push(categoryError);
      } else {
        updateData.category = item.category as Category;
      }
    }

    if (item.quantity !== undefined) {
      const quantityError = this.validateNumber(
        item.quantity,
        "Quantity",
        0,
        undefined,
        true
      );
      if (quantityError) {
        errors.push(quantityError);
      } else {
        updateData.quantity =
          typeof item.quantity === "number"
            ? item.quantity
            : parseInt(String(item.quantity), 10);
      }
    }

    if (item.price !== undefined) {
      const priceError = this.validateNumber(
        item.price,
        "Price",
        0,
        undefined,
        false
      );
      if (priceError) {
        errors.push(priceError);
      } else {
        updateData.price =
          typeof item.price === "number"
            ? item.price
            : parseFloat(String(item.price));
      }
    }

    if (item.supplier !== undefined) {
      const supplierError = this.validateRequiredString(item.supplier, "Supplier");
      if (supplierError) {
        errors.push(supplierError);
      } else {
        updateData.supplier = String(item.supplier).trim();
      }
    }

    if (item.stockStatus !== undefined) {
      const statusError = this.validateEnum(
        item.stockStatus,
        "Stock Status",
        Object.values(StockStatus)
      );
      if (statusError) {
        errors.push(statusError);
      } else {
        updateData.stockStatus = item.stockStatus as StockStatus;
      }
    }

    if (item.isPopular !== undefined) {
      updateData.isPopular = Boolean(item.isPopular);
    }

    if (item.notes !== undefined) {
      updateData.notes = item.notes ? String(item.notes).trim() : undefined;
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: errors.map((e) => e.message).join("; ")
      };
    }

    // Check if there's at least one field to update
    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        error: "At least one field must be provided for update"
      };
    }

    return {
      success: true,
      data: updateData
    };
  }

  /**
   * Validates search term
   */
  static validateSearchTerm(term: unknown): string {
    if (term === null || term === undefined) {
      return "";
    }
    return String(term).trim().toLowerCase();
  }

  /**
   * Sanitizes string input to prevent XSS
   */
  static sanitizeString(input: string): string {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }
}
