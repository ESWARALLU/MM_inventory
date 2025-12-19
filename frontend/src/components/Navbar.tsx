import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar(): ReactNode {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MM Automotives
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/inventory">Inventory</Link>
          </li>
          <li>
            <Link to="/manage-products">Manage Products</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
