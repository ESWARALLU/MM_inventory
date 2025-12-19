import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

export async function fetchProducts() {
  const { data } = await api.get('/products');
  return data.products;
}

export async function createProduct(payload) {
  const { data } = await api.post('/products', payload);
  return data;
}

export async function increaseStock(payload) {
  const { data } = await api.post('/stock/in', payload);
  return data;
}

export async function decreaseStock(payload) {
  const { data } = await api.post('/stock/out', payload);
  return data;
}
