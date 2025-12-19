import React, { ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import InventoryPage from './pages/InventoryPage';
import ManageProductsPage from './pages/ManageProductsPage';
import './styles.css';

function App(): ReactNode {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<InventoryPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/manage-products" element={<ManageProductsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
