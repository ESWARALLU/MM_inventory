import express, { Request, Response } from 'express';
import cors from 'cors';
import * as store from './store';
import type { ApiResponse, Product } from './types';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response): void => {
  res.json({ status: 'ok' });
});

app.get('/products', (req: Request, res: Response<ApiResponse<Product>>): void => {
  const products = store.getProducts();
  res.json({ message: 'Products retrieved', products });
});

app.post('/products', (req: Request, res: Response<ApiResponse<Product>>): void => {
  const { id, name, category, quantity } = req.body;
  const { product, error } = store.addProduct({ id, name, category, quantity });
  if (error) {
    res.status(400).json({ message: error });
    return;
  }
  res.status(201).json({ message: 'Product added', product });
});

app.post(
  '/stock/in',
  (req: Request, res: Response<ApiResponse<Product>>): void => {
    const { id, quantity } = req.body;
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      res.status(400).json({ message: 'Quantity must be positive' });
      return;
    }
    const { product, error } = store.adjustStock(id, qty);
    if (error) {
      const code = error === 'Product not found' ? 404 : 400;
      res.status(code).json({ message: error });
      return;
    }
    res.json({ message: 'Stock increased', product });
  }
);

app.post(
  '/stock/out',
  (req: Request, res: Response<ApiResponse<Product>>): void => {
    const { id, quantity } = req.body;
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      res.status(400).json({ message: 'Quantity must be positive' });
      return;
    }
    const { product, error } = store.adjustStock(id, -qty);
    if (error) {
      const code = error === 'Product not found' ? 404 : 400;
      res.status(code).json({ message: error });
      return;
    }
    res.json({ message: 'Stock decreased', product });
  }
);

app.delete(
  '/products/:id',
  (req: Request, res: Response<ApiResponse<Product>>): void => {
    const { id } = req.params;
    const { product, error } = store.removeProduct(id);
    if (error) {
      res.status(404).json({ message: error });
      return;
    }
    res.json({ message: 'Product removed', product });
  }
);

app.get('/history', (req: Request, res: Response): void => {
  const history = store.getStockHistory();
  res.json({ message: 'History retrieved', history });
});

app.delete('/history', (req: Request, res: Response): void => {
  const cleared = store.clearStockHistory();
  res.json({ message: 'History cleared', cleared });
});

app.use(
  (
    err: Error,
    req: Request,
    res: Response<ApiResponse<never>>,
    next: Function
  ): void => {
    console.error(err);
    res.status(500).json({ message: 'Unexpected server error' });
  }
);

app.listen(PORT, (): void => {
  console.log(`running on http://localhost:${PORT}`);
});
