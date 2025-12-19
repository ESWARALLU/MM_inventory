import React, { ReactNode, useState } from 'react';
import Swal from 'sweetalert2';
import UpdateStock from '../components/UpdateStock';
import StockHistory from '../components/StockHistory';
import { increaseStock, decreaseStock } from '../api';

function ManageProductsPage(): ReactNode {
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const handleStockChange = async (direction: 'in' | 'out', payload: { id: string; quantity: number }): Promise<void> => {
    try {
      if (direction === 'in') {
        await increaseStock(payload);
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Stock increased',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await decreaseStock(payload);
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Stock decreased',
          timer: 2000,
          showConfirmButton: false,
        });
      }
      // Trigger history refresh
      setHistoryRefresh((prev) => prev + 1);
    } catch (error: unknown) {
      const err = error as any;
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.response?.data?.message || 'Could not update stock',
      });
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <h1>Manage Products</h1>
        <p>Adjust stock levels and view movement history.</p>
      </header>

      <section className="card-grid">
        <div className="card">
          <h2>Update Stock</h2>
          <UpdateStock direction="in" onSubmit={(payload) => handleStockChange('in', payload)} />
          <UpdateStock direction="out" onSubmit={(payload) => handleStockChange('out', payload)} />
        </div>
      </section>

      <section className="table-card">
        <StockHistory refreshTrigger={historyRefresh} />
      </section>
    </div>
  );
}

export default ManageProductsPage;
