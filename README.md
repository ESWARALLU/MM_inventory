# MM Inventory

Simple inventory app to add products, adjust stock, and track history.

## Features
- Add products with ID, name, category, and initial quantity
- View inventory in a table with low-stock highlighting
- Increase or decrease stock with history tracking
- Export stock history to CSV, clear history, or export-and-clear
- Persistent data across restarts (stored in a JSON file)
- Sort by quantity and filter by category
- Clean, responsive UI with clear alerts

## Tech Stack
- Frontend: React 18 + TypeScript, Vite, React Router, Axios, SweetAlert2
- Backend: Node.js + Express + TypeScript
- Storage: JSON file (backend/data.json)

## Project Structure
```
MM_inventory/
├── backend/
│   ├── data.json
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts
│       ├── store.ts
│       └── types.ts
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── api.ts
        ├── App.tsx
        ├── main.tsx
        ├── styles.css
        ├── components/
        │   ├── AddProduct.tsx
        │   ├── InventoryList.tsx
        │   ├── Navbar.tsx
        │   ├── Navbar.css
        │   ├── StockHistory.tsx
        │   └── UpdateStock.tsx
        └── pages/
            ├── InventoryPage.tsx
            └── ManageProductsPage.tsx
```

## Getting Started

Prerequisites: Node.js 18 or newer is recommended.

Backend (API server)
```bash
cd backend
npm install
npm run dev
```
The API runs at http://localhost:4000

Frontend (web app)
```bash
cd frontend
npm install
npm run dev
```
The app runs at http://localhost:5173

## API Reference

Products
- GET /products — list all products
- POST /products — create a product
- DELETE /products/:id — remove a product

Stock
- POST /stock/in — increase stock (body: { id, quantity })
- POST /stock/out — decrease stock (body: { id, quantity })

History
- GET /history — list stock movements
- DELETE /history — clear all history

## Usage Tips
- Add a product with its initial quantity on the Inventory page.
- Use Manage Products to adjust stock and view history.
- Use the history toolbar to export CSV, clear, or export-and-clear.
- Sort by quantity or filter by category above the inventory table.

## Data Persistence
- All data lives in backend/data.json. Delete this file to reset the app.

## License
MIT
