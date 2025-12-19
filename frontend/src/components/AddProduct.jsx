import React, { useState } from 'react';

function AddProduct({ onSubmit }) {
  const [form, setForm] = useState({ id: '', name: '', category: '', quantity: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({ ...form, quantity: Number(form.quantity) });
    setForm({ id: '', name: '', category: '', quantity: '' });
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <label>
        Product ID
        <input
          name="id"
          value={form.id}
          onChange={handleChange}
          placeholder="sku-001"
          required
        />
      </label>
      <label>
        Name
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Blue T-Shirt"
          required
        />
      </label>
      <label>
        Category
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Apparel"
          required
        />
      </label>
      <label>
        Quantity
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          min="1"
          placeholder="10"
          required
        />
      </label>
      <button type="submit">Add Product</button>
    </form>
  );
}

export default AddProduct;
