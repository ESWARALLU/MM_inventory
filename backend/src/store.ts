// In-memory data store to keep the demo simple
import type { Product, StoreResult } from './types';
import fs from 'fs';
import path from 'path';

interface StockHistoryRecord {
  productId: string;
  change: number;
  type: 'IN' | 'OUT';
  timestamp: string;
}

const DATA_FILE = path.join(process.cwd(), 'data.json');

interface StorageData {
  products: Product[];
  stockHistory: StockHistoryRecord[];
}

let products: Product[] = [];
let stockHistory: StockHistoryRecord[] = [];

// Load data from file on startup
function loadData(): void {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed: StorageData = JSON.parse(data);
      products = parsed.products || [];
      stockHistory = parsed.stockHistory || [];
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Save data to file after every change
function saveData(): void {
  try {
    const data: StorageData = { products, stockHistory };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

function normalizeQuantity(value: unknown): StoreResult<number> {
  const qty = Number(value);
  if (!Number.isFinite(qty)) {
    return { error: 'Quantity must be a number' };
  }
  if (qty <= 0) {
    return { error: 'Quantity must be positive' };
  }
  return { product: qty };
}

function addProduct({
  id,
  name,
  category,
  quantity,
}: {
  id: unknown;
  name: unknown;
  category: unknown;
  quantity: unknown;
}): StoreResult {
  if (!id || !name || !category) {
    return { error: 'id, name, and category are required' };
  }

  const { error: qtyError, product: qty } = normalizeQuantity(quantity);
  if (qtyError || qty === undefined) {
    return { error: qtyError || 'Invalid quantity' };
  }

  const existing = products.find((item) => item.id === id);
  if (existing) {
    return { error: 'Product with this id already exists' };
  }

  const product: Product = {
    id: String(id),
    name: String(name),
    category: String(category),
    quantity: qty,
  };
  products.push(product);

  // Track initial quantity in stock history
  if (qty > 0) {
    stockHistory.push({
      productId: String(id),
      change: qty,
      type: 'IN',
      timestamp: new Date().toISOString(),
    });
  }

  saveData();
  return { product };
}

function getProducts(): Product[] {
  return products;
}

function adjustStock(id: unknown, delta: number): StoreResult {
  const product = products.find((item) => item.id === id);
  if (!product) {
    return { error: 'Product not found' };
  }

  const next = product.quantity + delta;
  if (next < 0) {
    return { error: 'Stock cannot go below zero' };
  }

  product.quantity = next;

  // Record stock movement in history
  const type = delta > 0 ? 'IN' : 'OUT';
  stockHistory.push({
    productId: String(id),
    change: Math.abs(delta),
    type,
    timestamp: new Date().toISOString(),
  });

  saveData();
  return { product };
}

function removeProduct(id: unknown): StoreResult {
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return { error: 'Product not found' };
  }
  const [removed] = products.splice(index, 1);
  saveData();
  return { product: removed };
}

function getStockHistory(): StockHistoryRecord[] {
  return stockHistory;
}

function clearStockHistory(): number {
  const cleared = stockHistory.length;
  stockHistory = [];
  saveData();
  return cleared;
}

// Initialize on module load
loadData();

export { addProduct, getProducts, adjustStock, removeProduct, getStockHistory, clearStockHistory };
