import React, { useState } from 'react';

function UpdateStock({ direction, onSubmit }) {
  const [form, setForm] = useState({ id: '', quantity: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({ id: form.id, quantity: Number(form.quantity) });
    setForm({ id: '', quantity: '' });
  };

  const label = direction === 'in' ? 'Stock In' : 'Stock Out';
  const icon = direction === 'in' ? '📦' : '📤';

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <h3>
        {icon} {label}
      </h3>
      <div className="row">
        <input
          name="id"
          value={form.id}
          onChange={handleChange}
          placeholder="Product ID"
          required
        />
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          min="1"
          placeholder="Qty"
          required
        />
        <button type="submit">{label}</button>
      </div>
    </form>
  );
}

export default UpdateStock;
