// In-memory data store to keep the demo simple
const products = [];

function normalizeQuantity(value) {
  const qty = Number(value);
  if (!Number.isFinite(qty)) return { error: 'Quantity must be a number' };
  if (qty <= 0) return { error: 'Quantity must be positive' };
  return { qty };
}

function addProduct({ id, name, category, quantity }) {
  if (!id || !name || !category) {
    return { error: 'id, name, and category are required' };
  }

  const { error: qtyError, qty } = normalizeQuantity(quantity);
  if (qtyError) return { error: qtyError };

  const existing = products.find((item) => item.id === id);
  if (existing) {
    return { error: 'Product with this id already exists' };
  }

  const product = { id, name, category, quantity: qty };
  products.push(product);
  return { product };
}

function getProducts() {
  return products;
}

function adjustStock(id, delta) {
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

function removeProduct(id) {
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return { error: 'Product not found' };
  }
  const [removed] = products.splice(index, 1);
  return { product: removed };
}

module.exports = {
  addProduct,
  getProducts,
  adjustStock,
  removeProduct,
};
