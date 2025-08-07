import React from 'react';
import './Header.js'; // We'll create this file for styling

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Jewel Store</div>
      <nav className="navigation">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/products">Products</a>
        <a href="/contact">Contact</a>
      </nav>
      <div className="actions">
        <a href="/signin">SIGN IN</a>
        <a href="/cart">Gart</a> {/* Assuming 'Gart' is 'Cart' */}
      </div>
    </header>
  );
};

export default Header;