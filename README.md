# Inventory Management System - Part 1

A TypeScript-based Inventory Management System for an electronics store. This is Part 1 of the PROG2005 Programming Mobile Systems assignment.

## Features

- **CRUD Operations**: Create, Read, Update, Delete inventory items
- **Search & Filter**: Search by name, filter by category, stock status, and popularity
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Form Validation**: Comprehensive input validation with error messages
- **Modern UI**: Clean, card-based interface with smooth animations

## Data Model

Each inventory item contains:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ID | string | Yes | Unique identifier (3-20 chars, alphanumeric) |
| Name | string | Yes | Item name |
| Category | enum | Yes | Electronics, Furniture, Clothing, Tools, Miscellaneous |
| Quantity | number | Yes | Stock quantity (>= 0) |
| Price | number | Yes | Price in USD (>= 0) |
| Supplier | string | Yes | Supplier name |
| Stock Status | enum | Yes | In Stock, Low Stock, Out of Stock |
| Is Popular | boolean | Yes | Whether item is popular |
| Notes | string | No | Additional notes |

## Project Structure

```
A2/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── tsconfig.json       # TypeScript configuration
├── package.json        # NPM dependencies
├── dist/               # Compiled JavaScript output
└── src/
    ├── models.ts       # TypeScript interfaces and enums
    ├── validation.ts   # Form validation logic
    ├── inventoryService.ts  # Business logic and data management
    ├── uiRenderer.ts   # UI rendering with innerHTML
    └── app.ts          # Main application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- NPM (comes with Node.js)

### Installation

1. Navigate to the project directory:

```bash
cd "C:\Users\Song\OneDrive\Desktop\集合\Programming Mobile System\A2"
```

2. Install dependencies:

```bash
npm install
```

### Build & Run

1. Compile TypeScript:

```bash
npm run build
```

2. Start a local server:

```bash
npx serve .
```

3. Open your browser and navigate to `http://localhost:3000`

### Development Mode (with auto-recompile)

```bash
npm run watch
```

Then serve the `dist` folder with any static file server.

## Usage

### View All Items

Click the "All Items" tab to see all inventory items displayed as cards.

### Add New Item

1. Click the "Add Item" tab
2. Fill in all required fields
3. Click "Add Item" to save

### Update Item

1. Click the "Update Item" tab
2. Enter the current item name
3. Fill in the fields you want to update (leave blank to keep current)
4. Click "Update Item" to save changes

### Delete Item

1. Click the "Delete Item" tab
2. Enter the item name
3. Click "Delete Item"
4. Confirm the deletion in the modal dialog

### Search & Filter

1. Click the "Search" tab
2. Enter a search term (optional)
3. Select category and/or stock status filters (optional)
4. Check "Popular Items Only" to filter by popularity
5. Click "Search" or "Show All" or "Show Popular"

## Technical Details

### TypeScript Features Used

- Interfaces and type aliases
- Enums
- Generics (OperationResult<T>)
- Strict type checking
- Module system (ES2020)

### UI Implementation

- All DOM updates use `innerHTML`
- No `alert()` dialogs - custom notification system
- Responsive CSS Grid and Flexbox layouts
- CSS custom properties for theming

### Validation

- Client-side validation with clear error messages
- Required field checking
- Type validation (numbers, enums)
- Format validation (ID pattern)
- XSS prevention via string sanitization

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

This project is for educational purposes as part of the PROG2005 course assignment.
