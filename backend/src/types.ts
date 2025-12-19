/**
 * Shared type definitions for MM Inventory
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
}

export interface ApiResponse<T> {
  message: string;
  product?: T;
  products?: T[];
}

export interface StoreResult<T = Product> {
  product?: T;
  error?: string;
}
