import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../utils/format";
import { getCategoryLabel } from "../data/products";
import WishlistButton from "./WishlistButton";
import styles from "./ProductCard.module.css";

// The one product tile used by the home page, the shop and similar items.
const ProductCard = ({ product, showMeta = false }) => {
  const { addToCart } = useCart();
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= 5;

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Link to={`/product/${product.id}`} className={styles.imageLink} tabIndex={-1} aria-hidden="true">
          <img src={product.image} alt="" className={styles.image} loading="lazy" />
        </Link>
        <WishlistButton product={product} size="medium" className="absolute-top-right" />
        {(soldOut || lowStock) && (
          <span className={`${styles.stockTag} ${soldOut ? styles.soldOut : ""}`}>
            {soldOut ? "Sold out" : `Only ${product.stock} left`}
          </span>
        )}
      </div>

      <div className={styles.body}>
        {showMeta && <p className={styles.meta}>{getCategoryLabel(product.category)}</p>}
        <h3 className={styles.name}>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        {showMeta && <p className={styles.material}>{product.material}</p>}
        <p className={styles.price}>{formatPrice(product.price)}</p>
      </div>

      <button
        type="button"
        className={styles.addButton}
        onClick={() => addToCart(product, 1)}
        disabled={soldOut}
        aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name} to cart`}
      >
        {soldOut ? "Sold out" : "Add to cart"}
      </button>
    </article>
  );
};

export default ProductCard;
