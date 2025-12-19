# MM Inventory

A simple, clean inventory management system built for a first-time hackathon.

## Tech Stack
- **Frontend:** React (Vite) + Axios
- **Backend:** Node.js + Express
- **Data:** In-memory storage (no database)

## Features
- ✅ Add products with ID, name, category, and quantity
- ✅ View all products in a table
- ✅ Increase stock (Stock In)
- ✅ Decrease stock (Stock Out)
- ✅ Real-time validation and error handling
- ✅ Clean, responsive UI

## Project Structure
```
MM_inventory/
├── backend/
│   ├── server.js       # Express API server
│   ├── store.js        # In-memory data store
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AddProduct.jsx
    │   │   ├── InventoryList.jsx
    │   │   └── UpdateStock.jsx
    │   ├── api.js       # Axios API calls
    │   ├── App.jsx      # Main app component
    │   ├── main.jsx     # Entry point
    │   └── styles.css   # Global styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
npm start
```
Backend runs on `http://localhost:4000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## API Endpoints

| Method | Endpoint      | Description          |
|--------|---------------|----------------------|
| GET    | /products     | Get all products     |
| POST   | /products     | Add a new product    |
| POST   | /stock/in     | Increase stock       |
| POST   | /stock/out    | Decrease stock       |

## Demo Instructions

1. Start the backend server first
2. Start the frontend development server
3. Open browser to `http://localhost:5173`
4. Add products using the form
5. Update stock using Stock In/Out buttons
6. Watch the inventory table update in real-time

## Future Enhancements
- Database integration (MongoDB/PostgreSQL)
- User authentication
- Product search and filtering
- Analytics dashboard
- Export inventory to CSV
- Barcode scanning

## License
MIT
