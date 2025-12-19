import axios, { AxiosError } from 'axios';

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
}

export interface ApiResponse<T = Product> {
  message: string;
  product?: T;
  products?: T[];
}

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<ApiResponse<Product>>('/products');
  return data.products || [];
}

export async function createProduct(
  payload: Omit<Product, 'quantity'> & { quantity: number }
): Promise<ApiResponse<Product>> {
  const { data } = await api.post<ApiResponse<Product>>('/products', payload);
  return data;
}

export async function increaseStock(payload: {
  id: string;
  quantity: number;
}): Promise<ApiResponse<Product>> {
  const { data } = await api.post<ApiResponse<Product>>('/stock/in', payload);
  return data;
}

export async function decreaseStock(payload: {
  id: string;
  quantity: number;
}): Promise<ApiResponse<Product>> {
  const { data } = await api.post<ApiResponse<Product>>('/stock/out', payload);
  return data;
}

export async function deleteProduct(id: string): Promise<ApiResponse<Product>> {
  const { data } = await api.delete<ApiResponse<Product>>(`/products/${id}`);
  return data;
}
