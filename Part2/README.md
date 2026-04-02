# Inventory Management System - Part 2 (Angular)

## Overview

Part 2 of the PROG2005 Programming Mobile Systems assessment. This is an Angular-based recreation/expansion of the Part 1 TypeScript inventory management system.

## Getting Started

```bash
npm install
npm start
npm run build
```

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
