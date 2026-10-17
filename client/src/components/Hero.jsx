import React from "react";
import { Link } from "react-router-dom";
import styles from "./Hero.module.css";

const Hero = () => (
  <section className={styles.heroSection}>
    <div className={styles.imageLeft} aria-hidden="true"></div>
    <div className={styles.imageMiddle} aria-hidden="true"></div>
    <div className={styles.imageRight} aria-hidden="true"></div>

    <div className={styles.contentContainer}>
      <h1 className={styles.heroHeading}>Gold, pearls and diamonds, chosen to be worn every day</h1>
      <p className={styles.heroSub}>Rings, necklaces, bracelets, earrings and anklets, delivered across South Africa.</p>
      <Link to="/products" className={styles.shopNowButton}>
        Shop the collection
      </Link>
    </div>
  </section>
);

export default Hero;
