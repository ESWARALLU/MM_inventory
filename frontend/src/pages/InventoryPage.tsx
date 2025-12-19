import React, { ReactNode, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AddProduct from '../components/AddProduct';
import InventoryList from '../components/InventoryList';
import { fetchProducts, deleteProduct, createProduct } from '../api';
import type { Product } from '../api';

function InventoryPage(): ReactNode {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [filterCategory, setFilterCategory] = useState<string>('');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts(): Promise<void> {
    setLoading(true);
    try {
      const list = await fetchProducts();
      setProducts(list);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Could not load products',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddProduct = async (payload: Omit<Product, 'quantity'> & { quantity: number }): Promise<void> => {
    try {
      await createProduct(payload);
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Product added',
        timer: 2000,
        showConfirmButton: false,
      });
      await loadProducts();
    } catch (error: unknown) {
      const err = error as any;
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.response?.data?.message || 'Could not add product',
      });
    }
  };

  const handleRemoveProduct = async (id: string): Promise<void> => {
    try {
      await deleteProduct(id);
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Product removed',
        timer: 2000,
        showConfirmButton: false,
      });
      await loadProducts();
    } catch (error: unknown) {
      const err = error as any;
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.response?.data?.message || 'Could not remove product',
      });
    }
  };

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  // Apply filtering and sorting
  const filteredAndSorted = products
    .filter((p) => (filterCategory ? p.category === filterCategory : true))
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.quantity - b.quantity;
      if (sortOrder === 'desc') return b.quantity - a.quantity;
      return 0;
    });

  return (
    <div className="page">
      <header className="hero">
        <h1>Inventory</h1>
        <p>View products and manage your inventory.</p>
      </header>

      <section className="card-grid">
        <div className="card">
          <h2>Add Product</h2>
          <AddProduct onSubmit={handleAddProduct} />
        </div>
      </section>

      <section className="table-card">
        <div className="table-header">
          <div>
            <h2>Products</h2>
            <p>Current products and quantities.</p>
          </div>
          <button className="ghost" onClick={loadProducts} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label htmlFor="sort-qty" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
              Sort by Quantity:
            </label>
            <select
              id="sort-qty"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'none' | 'asc' | 'desc')}
              style={{ padding: '0.5rem' }}
            >
              <option value="none">None</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-category" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
              Filter by Category:
            </label>
            <select
              id="filter-category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ padding: '0.5rem' }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <InventoryList products={filteredAndSorted} onRemove={handleRemoveProduct} />
      </section>
    </div>
  );
}

export default InventoryPage;
