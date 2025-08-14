import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import styles from './Hero.module.css';


const Hero = ({ shrink }) => {
  return (
    <section className={`${styles.heroSection} ${shrink ? styles.heroShrink : ""}`}>
      <div className={styles.imageLeft}></div>
      <div className={styles.imageRight}></div>

      <div className={styles.contentContainer}>
        <h1 className={styles.heroHeading}>
          Elevate Your Shopping Experience Today!
        </h1>

        <button className={styles.shopNowButton}>
          <div className={styles.shopNowContent}>
            <FaShoppingCart />
            Shop Now
          </div>
        </button>
      </div>
    </section>
  );
};

export default Hero;
