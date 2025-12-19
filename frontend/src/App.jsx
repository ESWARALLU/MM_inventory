import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, increaseStock, decreaseStock, deleteProduct } from './api';
import AddProduct from './components/AddProduct.jsx';
import UpdateStock from './components/UpdateStock.jsx';
import InventoryList from './components/InventoryList.jsx';

function App() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const list = await fetchProducts();
      setProducts(list);
    } catch (error) {
      setMessage({ type: 'error', text: 'Could not load products' });
    } finally {
      setLoading(false);
    }
  }

  const handleAddProduct = async (payload) => {
    try {
      await createProduct(payload);
      setMessage({ type: 'success', text: 'Product added' });
      await loadProducts();
    } catch (error) {
      const text = error?.response?.data?.message || 'Could not add product';
      setMessage({ type: 'error', text });
    }
  };

  const handleStockChange = async (direction, payload) => {
    try {
      if (direction === 'in') {
        await increaseStock(payload);
        setMessage({ type: 'success', text: 'Stock increased' });
      } else {
        await decreaseStock(payload);
        setMessage({ type: 'success', text: 'Stock decreased' });
      }
      await loadProducts();
    } catch (error) {
      const text = error?.response?.data?.message || 'Could not update stock';
      setMessage({ type: 'error', text });
    }
  };

  const handleRemoveProduct = async (id) => {
    try {
      await deleteProduct(id);
      setMessage({ type: 'success', text: 'Product removed' });
      await loadProducts();
    } catch (error) {
      const text = error?.response?.data?.message || 'Could not remove product';
      setMessage({ type: 'error', text });
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <h1>MM Inventory</h1>
        <p>Lightweight inventory tracker built for a first hackathon.</p>
      </header>

      <section className="card-grid">
        <div className="card">
          <h2>Add Product</h2>
          <AddProduct onSubmit={handleAddProduct} />
        </div>
        <div className="card">
          <h2>Update Stock</h2>
          <UpdateStock direction="in" onSubmit={(payload) => handleStockChange('in', payload)} />
          <UpdateStock direction="out" onSubmit={(payload) => handleStockChange('out', payload)} />
        </div>
      </section>

      <section className="table-card">
        <div className="table-header">
          <div>
            <h2>Inventory</h2>
            <p>Current products and quantities.</p>
          </div>
          <button className="ghost" onClick={loadProducts} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <InventoryList products={products} onRemove={handleRemoveProduct} />
      </section>

      {message && (
        <div className={`toast ${message.type}`} role="status" aria-live="polite">
          {message.text}
        </div>
      )}
    </div>
  );
}

export default App;
