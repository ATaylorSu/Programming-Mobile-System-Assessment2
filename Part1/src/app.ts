/**
 * Main Application Entry Point
 * Inventory Management System
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Part: Part 1 - TypeScript
 */

import { InventoryService } from "./inventoryService.js";
import { UIRenderer } from "./uiRenderer.js";
import { InventoryFilter } from "./models.js";

/**
 * Main Application class
 * Orchestrates the UI and service layers
 */
class InventoryApp {
  private service: InventoryService;
  private renderer: UIRenderer;
  private currentView: string = "list";

  constructor() {
    this.service = new InventoryService();
    this.renderer = new UIRenderer("app");
    this.init();
  }

  /**
   * Initialize the application
   */
  private init(): void {
    // Render the app layout
    this.renderer.renderApp();

    // Set up event listeners
    this.setupEventListeners();

    // Show initial view
    this.showListView();

    // Make app globally accessible for onclick handlers
    (window as unknown as { app: InventoryApp }).app = this;
  }

  /**
   * Set up event listeners for forms and buttons
   */
  private setupEventListeners(): void {
    // Wait for DOM to be ready, then set up form submissions
    document.addEventListener("submit", (e) => {
      const target = e.target as HTMLElement;

      if (target.id === "add-item-form") {
        e.preventDefault();
        this.handleAddItem(target as HTMLFormElement);
      } else if (target.id === "update-item-form") {
        e.preventDefault();
        this.handleUpdateItem(target as HTMLFormElement);
      } else if (target.id === "delete-item-form") {
        e.preventDefault();
        this.handleDeleteItem(target as HTMLFormElement);
      }
    });

    // Search-related buttons
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      if (target.id === "btn-search") {
        this.performSearch();
      } else if (target.id === "btn-show-all") {
        this.showListView();
      } else if (target.id === "btn-show-popular") {
        this.showPopularItems();
      }
    });

    // Filter change listeners
    document.addEventListener("change", (e) => {
      const target = e.target as HTMLElement;

      if (
        target.id === "filter-category" ||
        target.id === "filter-status" ||
        target.id === "filter-popular"
      ) {
        // Auto-search on filter change
        const searchTerm = (
          document.getElementById("search-term") as HTMLInputElement
        )?.value;
        if (searchTerm) {
          this.performSearch();
        }
      }
    });

    // Enter key in search box
    document.addEventListener("keypress", (e) => {
      const target = e.target as HTMLElement;

      if (e.key === "Enter" && target.id === "search-term") {
        e.preventDefault();
        this.performSearch();
      }
    });
  }

  /**
   * Switch between views
   */
  switchView(view: string): void {
    this.currentView = view;
    this.renderer.setActiveTab(view);

    switch (view) {
      case "list":
        this.showListView();
        break;
      case "add":
        this.renderer.renderAddForm();
        break;
      case "update":
        this.renderer.renderUpdateForm();
        break;
      case "delete":
        this.renderer.renderDeleteForm();
        break;
      case "search":
        this.renderer.renderSearchView();
        break;
      default:
        this.showListView();
    }
  }

  /**
   * Show list view with all items
   */
  showListView(): void {
    const items = this.service.getAllItems();
    this.renderer.renderListView(items);
    this.renderer.setActiveTab("list");
    this.currentView = "list";
  }

  /**
   * Show only popular items
   */
  showPopularItems(): void {
    const items = this.service.getPopularItems();
    this.renderer.renderSearchView();

    // Update the content after render
    setTimeout(() => {
      this.renderer.renderSearchResults(items, true);
    }, 0);
  }

  /**
   * Handle add item form submission
   */
  private handleAddItem(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const data: Record<string, unknown> = {};

    formData.forEach((value, key) => {
      if (key === "isPopular") {
        data[key] = value === "true";
      } else if (key === "quantity") {
        data[key] = parseInt(value as string, 10);
      } else if (key === "price") {
        data[key] = parseFloat(value as string);
      } else {
        data[key] = value;
      }
    });

    const result = this.service.createItem(data);

    if (result.success) {
      this.renderer.showNotification(
        `Successfully added item: ${result.data?.name}`,
        "success"
      );
      form.reset();
      this.showListView();
    } else {
      this.renderer.showNotification(result.error || "Failed to add item", "error");
    }
  }

  /**
   * Handle update item form submission
   */
  private handleUpdateItem(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const data: Record<string, unknown> = {};

    formData.forEach((value, key) => {
      if (key === "name" || value === "") return;

      if (key === "isPopular") {
        data[key] = value === "true";
      } else if (key === "quantity") {
        data[key] = parseInt(value as string, 10);
      } else if (key === "price") {
        data[key] = parseFloat(value as string);
      } else if (key === "newName") {
        data["name"] = value;
      } else {
        data[key] = value;
      }
    });

    // If no updates provided
    if (Object.keys(data).length === 0) {
      this.renderer.showNotification(
        "Please provide at least one field to update",
        "error"
      );
      return;
    }

    const result = this.service.updateItem(name, data);

    if (result.success) {
      this.renderer.showNotification(
        `Successfully updated item: ${result.data?.name}`,
        "success"
      );
      form.reset();
      this.showListView();
    } else {
      this.renderer.showNotification(result.error || "Failed to update item", "error");
    }
  }

  /**
   * Handle delete item form submission
   */
  private handleDeleteItem(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const name = formData.get("name") as string;

    if (!name.trim()) {
      this.renderer.showNotification("Please enter an item name", "error");
      return;
    }

    // Show confirmation modal
    this.renderer.showConfirmModal(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      () => {
        const result = this.service.deleteItem(name);

        if (result.success) {
          this.renderer.showNotification(
            `Successfully deleted item: ${result.data?.name}`,
            "success"
          );
          form.reset();
          this.showListView();
        } else {
          this.renderer.showNotification(
            result.error || "Failed to delete item",
            "error"
          );
        }
      }
    );
  }

  /**
   * Perform search based on filters
   */
  private performSearch(): void {
    const searchTerm = (
      document.getElementById("search-term") as HTMLInputElement
    )?.value;
    const category = (
      document.getElementById("filter-category") as HTMLSelectElement
    )?.value as InventoryFilter["category"];
    const stockStatus = (
      document.getElementById("filter-status") as HTMLSelectElement
    )?.value as InventoryFilter["stockStatus"];
    const showPopularOnly = (
      document.getElementById("filter-popular") as HTMLInputElement
    )?.checked;

    const filter: InventoryFilter = {
      searchTerm: searchTerm || undefined,
      category: category || undefined,
      stockStatus: stockStatus || undefined,
      showPopularOnly: showPopularOnly || undefined
    };

    const results = this.service.filterItems(filter);
    this.renderer.renderSearchView();

    // Re-render results after view is created
    setTimeout(() => {
      this.renderer.renderSearchResults(results, true);
    }, 0);
  }

  /**
   * Get the inventory service (for testing)
   */
  getService(): InventoryService {
    return this.service;
  }
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new InventoryApp();
});

// Also try to initialize immediately in case DOMContentLoaded already fired
if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(() => {
    if (!(window as unknown as { app?: InventoryApp }).app) {
      new InventoryApp();
    }
  }, 0);
}
