import React from 'react';
import ProductCard from './ProductCard.jsx';
import styles from './Products.module.css';

const dummyProducts = [
  { id: 1, name: 'Elegant Diamond Ring', price: '$1200', imageUrl: 'https://placehold.co/300x200/e0e0e0/333333?text=Product+1' },
  { id: 2, name: 'Sapphire Pendant Necklace', price: '$850', imageUrl: 'https://placehold.co/300x200/d0d0d0/333333?text=Product+2' },
  { id: 3, name: 'Classic Pearl Earrings', price: '$350', imageUrl: 'https://placehold.co/300x200/c0c0c0/333333?text=Product+3' },
  { id: 4, name: 'Gold Chain Bracelet', price: '$480', imageUrl: 'https://placehold.co/300x200/b0b0b0/333333?text=Product+4' },
  { id: 5, name: 'Emerald Studs', price: '$990', imageUrl: 'https://placehold.co/300x200/a0a0a0/333333?text=Product+5' },
  { id: 6, name: 'Silver Charm Bracelet', price: '$220', imageUrl: 'https://placehold.co/300x200/909090/333333?text=Product+6' },
];

const Products = () => {
  return (
    <section className={styles.productsSection}>
      <h2 className={styles.productsHeading}>Products</h2>
      <div className={styles.productGrid}>
        {dummyProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Products;