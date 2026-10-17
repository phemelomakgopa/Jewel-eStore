import React from "react";
import { Link } from "react-router-dom";
import styles from "./Categories.module.css";

import newJewelImg from "../assets/IMG-20250813-WA0024.jpg";
import ringsImg from "../assets/Gold_and_Diamonds_Ring.jpg";
import necklacesImg from "../assets/Gold_Necklaces.jpg";
import braceletsImg from "../assets/Pearly_Bracelet.jpg";
import earringsImg from "../assets/GoldFloral_Earrings.jpg";
import ankletsImg from "../assets/IMG-20250813-WA0017.jpg";

const categories = [
  { name: "New in", image: newJewelImg, to: "/products?sort=newest" },
  { name: "Rings", image: ringsImg, to: "/products?category=rings" },
  { name: "Necklaces", image: necklacesImg, to: "/products?category=necklaces" },
  { name: "Bracelets", image: braceletsImg, to: "/products?category=bracelets" },
  { name: "Earrings", image: earringsImg, to: "/products?category=earrings" },
  { name: "Anklets", image: ankletsImg, to: "/products?category=anklets" },
];

const Categories = () => (
  <section className={styles.categoriesSection} aria-labelledby="categories-heading">
    <div className={styles.sectionDivider}>
      <h2 id="categories-heading" className={styles.categoriesHeading}>
        Shop by category
      </h2>
    </div>

    <ul className={styles.categoryList}>
      {categories.map((category) => (
        <li key={category.name}>
          <Link to={category.to} className={styles.categoryCard}>
            <img src={category.image} alt="" className={styles.categoryImage} loading="lazy" />
            <span className={styles.categoryText}>{category.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default Categories;
