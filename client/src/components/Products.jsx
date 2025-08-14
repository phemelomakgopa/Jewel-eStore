import React, {useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
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
  { id: 1, name: "Bronze Ring", image: Bronze_Ring, price: 1999, category: "rings" },
  { id: 2, name: "Chain & Pearly Bracelet", image: Chain_Pearly_Bracelet, price: 4599, category: "bracelets" },
  { id: 3, name: "Chain Diamond Bracelet", image: ChainDiamond_Bracelet, price: 7999, category: "bracelets" },
  { id: 4, name: "Diamond Bracelet", image: Diamond_Bracelet, price: 9999, category: "bracelets" },
  { id: 5, name: "Diamond Heart Earrings", image: Diamond_Heart_Earrings, price: 5999, category: "earrings" },
  { id: 6, name: "Diamond Ring", image: Diamond_Ring, price: 8999, category: "rings" },
  { id: 7, name: "Diamond Stone and Gold Ring", image: DiamondStone_GOld_Ring, price: 7550, category: "rings" },
  { id: 8, name: "Distant Pearly Bracelet", image: Disntant_Pearly_Bracelet, price: 2999, category: "bracelets" },
  { id: 9, name: "Flat Pearls Bracelet", image: Flat_Pearls_Bracelet, price: 3499, category: "bracelets" },
  { id: 10, name: "Gear Diamond & Gold Ring", image: GearDiamond_Gold_Ring, price: 6999, category: "rings" },
  { id: 11, name: "Gear Diamond & Gold Ring 2", image: GearDiamond_Gold_Ring2, price: 7499, category: "rings" },
  { id: 12, name: "Gear Diamond & Gold Ring 3", image: GearDiamond_Gold_Ring3, price: 6500, category: "rings" },
  { id: 13, name: "Hooked Pearl & Gold Heart Earrings", image: HookedPearl_GoldHeart_Earrings, price: 4999, category: "earrings" },
  { id: 14, name: "Heart Pearl Earrings", image: HeartPearl_Earrings, price: 3950, category: "earrings" },
  { id: 15, name: "Gold Floral Earrings", image: GoldFloral_Earrings, price: 5599, category: "earrings" },
  { id: 16, name: "Gold Chained Earrings", image: GoldChained_Earrings, price: 4299, category: "earrings" },
  { id: 17, name: "Gold & Whitey Earrings", image: Gold_Whitey_Earrings, price: 3200, category: "earrings" },
];

const Products = ({ categoryFilter = null }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [addedProductId, setAddedProductId] = useState(null);

  // Filter products by category if a filter is provided
  const filteredProducts = categoryFilter 
    ? products.filter(product => product.category && product.category === categoryFilter)
    : products;

  // Reset the added product message after 2 seconds
  useEffect(() => {
    if (addedProductId) {
      const timer = setTimeout(() => {
        setAddedProductId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [addedProductId]);

  const handleAddToCart = async (product) => {
    try {
      setLoadingProductId(product.id);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category
        },
        1 // Always add 1 item at a time
      );
      
      setAddedProductId(product.id);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <section className={styles.productsSection}>
      <div className={styles.sectionDivider} data-aos="fade-up">
        <span className={styles.productsHeading}>
          {categoryFilter ? categoryFilter.toUpperCase() : 'PRODUCTS'}
        </span>
      </div>

      <div className={styles.productsGrid}>
        {filteredProducts.map((product, index) => (
          <Link
            to={`/product/${index + 1}`} key={product.id || index} className={styles.productCard} data-aos="fade-up" data-aos-delay={index * 60}>
            <div className={styles.imageContainer} onClick={() => product.id && navigate(`/product/${product.id}`)}>
              <img 
                src={product.image} 
                alt={product.name} 
                className={styles.productImage} 
                loading="lazy"
              />
            </div>
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productPrice}>R{product.price.toFixed(2)}</p>
            <button className={styles.addToCartBtn}>Add to Cart</button>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className={styles.noProducts}>
            No products found in this category.
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
