import React, { FormEvent, ChangeEvent, ReactNode } from 'react';
import type { Product } from '../api';

interface AddProductProps {
  onSubmit: (payload: Omit<Product, 'quantity'> & { quantity: number }) => Promise<void>;
}

function AddProduct({ onSubmit }: AddProductProps): ReactNode {
  const [form, setForm] = React.useState({ id: '', name: '', category: '', quantity: '' });

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
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
          placeholder="mal-3d"
          required
        />
      </label>
      <label>
        Name
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="3D-mat-au"
          required
        />
      </label>
      <label>
        Category
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="3D-mats"
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
