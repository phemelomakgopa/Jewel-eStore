import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/products";
import styles from "./Footer.module.css";

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.brand}>
        <Link to="/" className={styles.logo}>
          Jewel Store.
        </Link>
        <p>Rings, necklaces, bracelets, earrings and anklets, delivered across South Africa.</p>
      </div>

      <nav aria-label="Shop">
        <h2 className={styles.heading}>Shop</h2>
        <ul>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link to={`/products?category=${c.slug}`}>{c.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Account">
        <h2 className={styles.heading}>Account</h2>
        <ul>
          <li>
            <Link to="/orders">Your orders</Link>
          </li>
          <li>
            <Link to="/wishlist">Wishlist</Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
        </ul>
      </nav>

      <div>
        <h2 className={styles.heading}>Help</h2>
        <ul>
          <li>
            <Link to="/about">About us</Link>
          </li>
          <li>
            <a href="mailto:orders@jewelestore.co.za">orders@jewelestore.co.za</a>
          </li>
          <li>R60 flat-rate delivery, 3–5 working days</li>
        </ul>
      </div>
    </div>

    <p className={styles.footerText}>
      &copy; {new Date().getFullYear()} Jewel Store. A demo store; product photos are compiled from publicly available
      sources.
    </p>
  </footer>
);

export default Footer;
