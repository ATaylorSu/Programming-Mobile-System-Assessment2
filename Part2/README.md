# Inventory Management System - Part 2 (Angular)

## Overview

Part 2 of the PROG2005 Programming Mobile Systems assessment. This is an Angular-based recreation/expansion of the Part 1 TypeScript inventory management system.

## Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Homepage with app purpose, stats, and navigation |
| `/inventory` | Inventory | Full CRUD: view all, add, update, delete items |
| `/search` | Search | Search by name + filter by category, status, popularity |
| `/privacy` | Privacy | Privacy and security analysis page |
| `/help` | Help | FAQ and troubleshooting guidance |

## Tech Stack

- **Angular 17** (standalone components disabled, uses NgModule)
- **TypeScript** (strict mode)
- **Angular Router** (5 routes)
- **Angular Forms** (Template-driven + Reactive)
- **RxJS** (services)

## Getting Started

### Prerequisites

- Node.js v14 or higher
- npm (comes with Node.js)

### Installation

```bash
cd part2
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload on file changes.

### Build

```bash
npm run build
```

Production build artifacts are stored in the `dist/` directory.

## Features

- **CRUD Operations**: Create, read, update, delete inventory items
- **Search & Filter**: Search by name, filter by category, stock status, popularity
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 480px
- **Form Validation**: Client-side validation for all inputs (type, range, required)
- **Angular Components**: 5 page components + 1 root component
- **Angular Service**: InventoryService with injectable singleton pattern
- **Angular Router**: Client-side routing with navigation
- **Privacy & Security**: Dedicated analysis page with OWASP and best practice references
- **FAQ**: Interactive accordion with 10 common questions

## Data Model

All data stored in-browser (session only). Same model as Part 1:

| Field | Type | Required |
|-------|------|----------|
| ID | string (3-20 chars, alphanumeric) | Yes |
| Name | string | Yes |
| Category | Electronics, Furniture, Clothing, Tools, Miscellaneous | Yes |
| Quantity | number (>= 0) | Yes |
| Price | number (>= 0) | Yes |
| Supplier | string | Yes |
| Stock Status | In Stock, Low Stock, Out of Stock | Yes |
| Is Popular | boolean | Yes |
| Notes | string | No |

## Project Structure

```
part2/
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   └── app/
│       ├── app.module.ts
│       ├── app.component.ts
│       ├── app-routing.module.ts
│       ├── models.ts
│       ├── inventory.service.ts
│       └── components/
│           ├── home/home.component.ts
│           ├── inventory/inventory.component.ts
│           ├── search/search.component.ts
│           ├── privacy/privacy.component.ts
│           └── help/help.component.ts
├── angular.json
├── package.json
└── tsconfig.json
```
