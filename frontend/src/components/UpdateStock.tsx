import React, { ReactNode } from 'react';
import type { Product } from '../api';

interface UpdateStockProps {
  direction: 'in' | 'out';
  onSubmit: (payload: { id: string; quantity: number }) => Promise<void>;
}

function UpdateStock({ direction, onSubmit }: UpdateStockProps): ReactNode {
  const [form, setForm] = React.useState({ id: '', quantity: '' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
