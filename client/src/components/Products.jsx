import React from "react";
import { Link } from "react-router-dom";
import products from "../data/products";
import { filterProducts } from "../utils/catalog";
import ProductCard from "./ProductCard";
import styles from "./Products.module.css";

// Home-page selection: the newest pieces, with a way into the full shop.
const Products = ({ limit = 10 }) => {
  const newest = filterProducts({ q: "", sort: "newest" }).slice(0, limit);

  return (
    <section className={styles.productsSection} aria-labelledby="new-in-heading">
      <div className={styles.sectionDivider}>
        <h2 id="new-in-heading" className={styles.productsHeading}>
          New in
        </h2>
      </div>

      <div className={styles.productsGrid}>
        {newest.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className={styles.more}>
        <Link to="/products" className="btn btn-secondary">
          Shop all {products.length} pieces
        </Link>
      </div>
    </section>
  );
};

export default Products;
