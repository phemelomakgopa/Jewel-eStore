import React from "react";
import { Link } from "react-router-dom"
import styles from "./Products.module.css";

// images
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

const products = [
  { name: "Bronze Ring", image: Bronze_Ring, price: 19.99 },
  { name: "Chain & Pearly Bracelet", image: Chain_Pearly_Bracelet, price: 45.99 },
  { name: "Chain Diamond Bracelet", image: ChainDiamond_Bracelet, price: 79.99 },
  { name: "Diamond Bracelet", image: Diamond_Bracelet, price: 99.99 },
  { name: "Diamond Heart Earrings", image: Diamond_Heart_Earrings, price: 59.99 },
  { name: "Diamond Ring", image: Diamond_Ring, price: 89.99 },
  { name: "Diamond Stone and Gold Ring", image: DiamondStone_GOld_Ring, price: 75.5 },
  { name: "Distant Pearly Bracelet", image: Disntant_Pearly_Bracelet, price: 29.99 },
  { name: "Flat Pearls Bracelet", image: Flat_Pearls_Bracelet, price: 34.99 },
  { name: "Gear Diamond & Gold Ring", image: GearDiamond_Gold_Ring, price: 69.99 },
  { name: "Gear Diamond & Gold Ring 2", image: GearDiamond_Gold_Ring2, price: 74.99 },
  { name: "Gear Diamond & Gold Ring 3", image: GearDiamond_Gold_Ring3, price: 65.0 },
  { name: "Hooked Pearl & Gold Heart Earrings", image: HookedPearl_GoldHeart_Earrings, price: 49.99 },
  { name: "Heart Pearl Earrings", image: HeartPearl_Earrings, price: 39.5 },
  { name: "Gold Floral Earrings", image: GoldFloral_Earrings, price: 55.99 },
  { name: "Gold Chained Earrings", image: GoldChained_Earrings, price: 42.99 },
  { name: "Gold & Whitey Earrings", image: Gold_Whitey_Earrings, price: 32.0 },
];

const Products = () => {
  return (
    <section className={styles.productsSection}>
      <div className={styles.sectionDivider} data-aos="fade-up">
        <span className={styles.productsHeading}>PRODUCTS</span>
      </div>

      <div className={styles.productsGrid}>
        {products.map((product, index) => (
          <Link
            to={`/product/${index + 1}`}
            key={index}
            className={styles.productCard}
            data-aos="fade-up"
            data-aos-delay={index * 60}
          >
            <img
              src={product.image}
              alt={product.name}
              className={styles.productImage}
            />
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productPrice}>R{product.price.toFixed(2)}</p>
            <button className={styles.addToCartBtn}>Add to Cart</button>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Products;
