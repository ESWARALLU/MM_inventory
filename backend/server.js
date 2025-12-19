const express = require('express');
const cors = require('cors');
const store = require('./store');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/products', (req, res) => {
  const products = store.getProducts();
  res.json({ products });
});

app.post('/products', (req, res) => {
  const { id, name, category, quantity } = req.body;
  const { product, error } = store.addProduct({ id, name, category, quantity });
  if (error) {
    return res.status(400).json({ message: error });
  }
  return res.status(201).json({ message: 'Product added', product });
});

app.post('/stock/in', (req, res) => {
  const { id, quantity } = req.body;
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty <= 0) {
    return res.status(400).json({ message: 'Quantity must be positive' });
  }
  const { product, error } = store.adjustStock(id, qty);
  if (error) {
    return res.status(400).json({ message: error });
  }
  return res.json({ message: 'Stock increased', product });
});

app.post('/stock/out', (req, res) => {
  const { id, quantity } = req.body;
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty <= 0) {
    return res.status(400).json({ message: 'Quantity must be positive' });
  }
  const { product, error } = store.adjustStock(id, -qty);
  if (error) {
    return res.status(400).json({ message: error });
  }
  return res.json({ message: 'Stock decreased', product });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

app.listen(PORT, () => {
  console.log(`Inventory API running on http://localhost:${PORT}`);
});
