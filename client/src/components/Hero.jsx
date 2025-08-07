import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import styles from './Hero.module.css'; // Import the CSS Module

const Hero = () => {
  return (
    <section className={styles.heroSection}>
      {/* Floating Glass Card Background */}
      <div className={styles.glassCardBackground}>
        <div className={styles.glassCard}></div>
      </div>

      <div className={styles.contentContainer}>
        {/* Left Side Text */}
        <div className={styles.textContainer}>
          <h1 className={styles.heroHeading}>
            Discover the Perfect Jewelry
          </h1>
          <p className={styles.heroParagraph}>
            Shop timeless designs and premium craftsmanship for any occasion.
          </p>
          <button className={styles.shopNowButton}>
            <div className={styles.shopNowContent}>
              <FaShoppingCart />
              Shop Now
            </div>
          </button>
        </div>

        {/* Right Side Image */}
        <div className={styles.imageContainer}>
          <img
            src="https://via.placeholder.com/400x300.png?text=Product+Preview"
            alt="Hero Jewelry"
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
