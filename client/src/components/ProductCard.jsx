import React from 'react';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  return (
    <div className={styles.productCard}>
      <img
        src={product.imageUrl}
        alt={product.name}
        className={styles.productImage}
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200/cccccc/333333?text=Image+Not+Found'; }}
      />
      <h3 className={styles.productName}>{product.name}</h3>
      <p className={styles.productPrice}>{product.price}</p>
      <button className={styles.addToCartButton}>Add to cart</button>
    </div>
  );
};

export default ProductCard;