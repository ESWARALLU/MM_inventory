// In-memory data store to keep the demo simple
import type { Product, StoreResult } from './types';

const products: Product[] = [];

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
  return { product };
}

function removeProduct(id: unknown): StoreResult {
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return { error: 'Product not found' };
  }
  const [removed] = products.splice(index, 1);
  return { product: removed };
}

export { addProduct, getProducts, adjustStock, removeProduct };
