/*import React from 'react';
import ProductCard from './ProductCard.jsx';
import styles from './Products.module.css';

const dummyProducts = [
  { id: 1, name: 'Elegant Diamond Ring', price: 'R1200', imageUrl: 'https://placehold.co/300x200/e0e0e0/333333?text=Product+1' },
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

export default Products;*/

import React from "react";
import styles from "./Products.module.css";

// Import images from assets
import Bronze_Ring from "../assets/Bronze_Ring.jpg";
import Chain_Pearly_Bracelet from "../assets/Chain+Pearly_Bracelet.jpg";
import ChainDiamond_Bracelet from "../assets/ChainDiamond_Bracelet.jpg";
import Diamond_Bracelet from "../assets/Diamond_Bracelet.jpg";
import Diamond_Heart_Earrings from "../assets/Diamond_Heart_Earrings.jpg";
import Diamond_Ring from "../assets/Diamond_Ring.jpg";
import DiamondStone_GOld_Ring from "../assets/DiamondStone+GOld_Ring.jpg";
import Disntant_Pearly_Bracelet from "../assets/Disntant_Pearly_Bracelet.jpg";
import Flat_Pearls_Bracelet from "../assets/Flat_Pearls_Bracelet.jpg";
import GearDiamond_Gold_Ring from "../assets/GearDiamond+Gold_Ring.jpg";
import GearDiamond_Gold_Ring2 from "../assets/GearDiamond+Gold_Ring2.jpg";
import GearDiamond_Gold_Ring3 from "../assets/GearDiamond+Gold_Ring3.jpg";
import HookedPearl_GoldHeart_Earrings from "../assets/HookedPearl+GoldHeart_Earrings.jpg";
import HeartPearl_Earrings from "../assets/HeartPearl_Earrings.jpg";
import GoldFloral_Earrings from "../assets/GoldFloral_Earrings.jpg";
import GoldChained_Earrings from "../assets/GoldChained_Earrings.jpg";
import Gold_Whitey_Earrings from "../assets/Gold+Whitey_Earrings.jpg";

// Dummy products
const products = [
  { name: "Bronze Ring", image: Bronze_Ring, price: 19.99 },
  { name: "Chain & Pearly Bracelet", image: Chain_Pearly_Bracelet, price: 45.99 },
  { name: "Chain Diamond Bracelet", image: ChainDiamond_Bracelet, price: 79.99 },
  { name: "Diamond Bracelet", image: Diamond_Bracelet, price: 99.99 },
  { name: "Diamond Heart Earrings", image: Diamond_Heart_Earrings, price: 59.99 },
  { name: "Diamond Ring", image: Diamond_Ring, price: 89.99 },
  { name: "Diamond Stone and Gold Ring", image: DiamondStone_GOld_Ring, price: 75.50 },
  { name: "Distant Pearly Bracelet", image: Disntant_Pearly_Bracelet, price: 29.99 },
  { name: "Flat Pearls Bracelet", image: Flat_Pearls_Bracelet, price: 34.99 },
  { name: "Gear Diamond & Gold Ring", image: GearDiamond_Gold_Ring, price: 69.99 },
  { name: "Gear Diamond & Gold Ring 2", image: GearDiamond_Gold_Ring2, price: 74.99 },
  { name: "Gear Diamond & Gold Ring 3", image: GearDiamond_Gold_Ring3, price: 65.00 },
  { name: "Hooked Pearl & Gold Heart Earrings", image: HookedPearl_GoldHeart_Earrings, price: 49.99 },
  { name: "Heart Pearl Earrings", image: HeartPearl_Earrings, price: 39.50 },
  { name: "Gold Floral Earrings", image: GoldFloral_Earrings, price: 55.99 },
  { name: "Gold Chained Earrings", image: GoldChained_Earrings, price: 42.99 },
  { name: "Gold & Whitey Earrings", image: Gold_Whitey_Earrings, price: 32.00 },
];

const Products = () => {
  return (
    <section className={styles.productsSection}>
      {/* Divider with title */}
      <div className={styles.sectionDivider}>
        <span className={styles.productsHeading}>PRODUCTS</span>
      </div>

      {/* Products grid */}
      <div className={styles.productsGrid}>
        {products.map((product, index) => (
          <div key={index} className={styles.productCard}>
            <img src={product.image} alt={product.name} className={styles.productImage} />
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productPrice}>R{product.price.toFixed(2)}</p>
            <button className={styles.addToCartBtn}>Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
