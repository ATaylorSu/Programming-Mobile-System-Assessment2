# Inventory Management System - Part 1

## Features

- **CRUD Operations**: Create, Read, Update, Delete inventory items
- **Search & Filter**: Search by name, filter by category, stock status, and popularity
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Form Validation**: Comprehensive input validation with error messages
- **Modern UI**: Clean, card-based interface with smooth animations

## Project Structure

```
Part1/
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
cd "C:\Users\Song\OneDrive\Desktop\集合\Programming Mobile System\A2\Part1"
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

2. Start a local server (pick **one** of these):

```bash
npm start
```

This compiles TypeScript and serves the **current folder** (`Part1`), where `index.html` lives.

Or, after `npm run build`:

```bash
npm run serve
```

**Important:** Run these commands **from inside the `Part1` folder**. If you are already in `Part1`, do **not** run `npx serve Part1` — that looks for a subfolder named `Part1` and will return **404** for `/`. Use `npm run serve` or `npx serve .` instead.

If you are in the parent folder `A2` (one level above `Part1`), then you can run:

```bash
npx serve Part1
```

3. Open your browser and navigate to `http://localhost:3000` (or the URL shown in the terminal)

### Development Mode (with auto-recompile)

```bash
npm run watch
```

Then serve the `dist` folder with any static file server.
