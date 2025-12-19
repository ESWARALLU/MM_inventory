import React, { ReactNode } from 'react';
import type { Product } from '../api';

interface InventoryListProps {
  products: Product[];
  onRemove?: (id: string) => Promise<void>;
}

function InventoryList({ products, onRemove }: InventoryListProps): ReactNode {
  if (products.length === 0) {
    return <p className="empty">No products in inventory yet.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.category}</td>
            <td>
              <span className={product.quantity < 10 ? 'low-stock' : ''}>
                {product.quantity}
              </span>
            </td>
            <td>
              <button
                className="danger"
                onClick={() => onRemove?.(product.id)}
                aria-label={`Remove ${product.name}`}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default InventoryList;
