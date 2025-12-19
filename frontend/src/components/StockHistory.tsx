import React, { useEffect, useState, ReactNode } from 'react';
import Swal from 'sweetalert2';

interface HistoryRecord {
  productId: string;
  change: number;
  type: 'IN' | 'OUT';
  timestamp: string;
}

interface StockHistoryProps {
  refreshTrigger?: number;
}

function StockHistory({ refreshTrigger }: StockHistoryProps): ReactNode {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]);

  async function loadHistory(): Promise<void> {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/history');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Could not load stock history',
      });
    } finally {
      setLoading(false);
    }
  }

  function exportToCSV(data: HistoryRecord[]): void {
    const headers = ['productId', 'type', 'change', 'timestamp'];
    const rows = data.map((r) => [r.productId, r.type, String(r.change), r.timestamp]);
    const csv = [headers.join(','), ...rows.map((row) => row.map((v) => `"${v.replace?.(/"/g, '""') || v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
    a.href = url;
    a.download = `stock-history-${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleExport(): Promise<void> {
    if (history.length === 0) {
      await Swal.fire({ icon: 'info', title: 'No data', text: 'No history to export.' });
      return;
    }
    exportToCSV(history);
    await Swal.fire({ icon: 'success', title: 'Exported', text: 'CSV download started.', timer: 1500, showConfirmButton: false });
  }

  async function handleClear(): Promise<void> {
    if (history.length === 0) {
      await Swal.fire({ icon: 'info', title: 'Nothing to clear', text: 'History is already empty.' });
      return;
    }
    const result = await Swal.fire({ icon: 'warning', title: 'Clear history?', text: 'This cannot be undone.', showCancelButton: true, confirmButtonText: 'Clear', confirmButtonColor: '#e53e3e' });
    if (!result.isConfirmed) return;
    try {
      const resp = await fetch('http://localhost:4000/history', { method: 'DELETE' });
      if (!resp.ok) throw new Error('Failed to clear');
      setHistory([]);
      await Swal.fire({ icon: 'success', title: 'Cleared', text: 'History cleared.', timer: 1500, showConfirmButton: false });
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'Error', text: 'Could not clear history.' });
    }
  }

  async function handleExportAndClear(): Promise<void> {
    if (history.length === 0) {
      await Swal.fire({ icon: 'info', title: 'No data', text: 'No history to export.' });
      return;
    }
    const result = await Swal.fire({ icon: 'warning', title: 'Export and clear?', text: 'We will download a CSV, then clear history.', showCancelButton: true, confirmButtonText: 'Export & Clear', confirmButtonColor: '#667eea' });
    if (!result.isConfirmed) return;
    exportToCSV(history);
    try {
      const resp = await fetch('http://localhost:4000/history', { method: 'DELETE' });
      if (!resp.ok) throw new Error('Failed to clear');
      setHistory([]);
      await Swal.fire({ icon: 'success', title: 'Done', text: 'Exported and cleared.', timer: 1500, showConfirmButton: false });
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'Error', text: 'Exported, but failed to clear history.' });
    }
  }

  if (loading) {
    return <p>Loading history...</p>;
  }

  if (history.length === 0) {
    return <p className="empty">No stock movements yet.</p>;
  }

  return (
    <>
      <div className="table-header" style={{ marginTop: '0.5rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Stock Movement History</h2>
          <p>All stock-in and stock-out operations.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="ghost" onClick={handleExport}>Export CSV</button>
          <button className="ghost" onClick={handleExportAndClear}>Export & Clear</button>
          <button className="danger" onClick={handleClear}>Clear History</button>
        </div>
      </div>
      <table>
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Type</th>
          <th>Change</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {history.map((record, index) => (
          <tr key={index}>
            <td>{record.productId}</td>
            <td>
              <span className={record.type === 'IN' ? 'in-badge' : 'out-badge'}>
                {record.type}
              </span>
            </td>
            <td>{record.change}</td>
            <td>{new Date(record.timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
      </table>
    </>
  );
}

export default StockHistory;
