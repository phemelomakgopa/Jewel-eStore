import React from "react";
import styles from "./Navbar.module.css"; // Import the CSS Module
import { useAuth } from "../contexts/AuthContext";
import UserProfile from "./UserProfile";

import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { currentUser } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo/Brand Name */}
        <a href="/" className={styles.logo}>
          Jewel Store.
        </a>

        {/* Navigation Links (Desktop) */}
        <div className={styles.navLinksDesktop}>
          <a href="/" className={styles.navLink}>
            Home
          </a>
          <a href="/about" className={styles.navLink}>
            About
          </a>
          <a href="/products" className={styles.navLink}>
            Products
          </a>
          <a href="/contact" className={styles.navLink}>
            Contact
          </a>
        </div>

        {/* Action Buttons (Desktop) */}
        <div className={styles.actionButtonsDesktop}>
          {!currentUser ? (
            <a href="/signin" className={styles.signInLink}>
              SIGN IN
            </a>
          ) : null}

          <a href="/cart" className={styles.cartButton}>
            <FaShoppingCart className={styles.cartIcon} />
          </a>

          {currentUser ? (
            <UserProfile />
          ) : (
            <FaUserCircle className={styles.userIcon} />
          )}
        </div>
      </div>
    </nav>
  );
};

// src/components/Navbar.jsx

export default Navbar;

/* src/components/Navbar.jsx
//import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
export default function Navbar() {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-yellow-600">Jewel Store</h1>
      <nav className="space-x-6 text-sm font-medium">
        <a href="#" className="hover:text-yellow-600 transition">Home</a>
        <a href="#" className="hover:text-yellow-600 transition">Sign In</a>
        <a href="#" className="hover:text-yellow-600 transition">About</a>
        <a href="#" className="hover:text-yellow-600 transition">Products</a>
        <a href="#" className="hover:text-yellow-600 transition">Contact</a>
      </nav>
    </header>
  );
}

//import './Navbar.css'; // Assuming you have a CSS file for Navbar styles*/
