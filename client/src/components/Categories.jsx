import React from 'react';
import styles from './Categories.module.css';

import newJewelImg from '../assets/Bronze_Ring.jpg';
import ringsImg from '../assets/Gold_and_Diamonds_Ring.jpg';
import necklacesImg from '../assets/Gold_Necklaces.jpg';
import braceletsImg from '../assets/Pearly_Bracelet.jpg';
import earringsImg from '../assets/GoldFloral_Earrings.jpg';
import ankletsImg from '../assets/IMG-20250813-WA0017.jpg';

const categories = [
  { name: 'NEW JEWELS', image: newJewelImg },
  { name: 'RINGS', image: ringsImg },
  { name: 'NECKLACES', image: necklacesImg },
  { name: 'BRACELETS', image: braceletsImg },
  { name: 'EARRINGS', image: earringsImg },
  { name: 'ANKLETS', image: ankletsImg },
];

const Categories = () => {
  return (
    <section className={styles.categoriesSection}>
      {/* Divider Line with Text */}
      <div className={styles.sectionDivider} data-aos="fade-up">
        <span className={styles.categoriesHeading}>CATEGORIES</span>
      </div>

      {/* Categories List */}
      <div className={styles.categoryList}>
        {categories.map((category, index) => (
          <div
            key={index}
            className={styles.categoryItem}
            data-aos="fade-up"
            data-aos-delay={index * 80}
          >
            <div className={styles.categoryCard}>
              <img
                src={category.image}
                alt={category.name}
                className={styles.categoryImage}
              />
              <div className={styles.categoryOverlay}>
                <span className={styles.categoryText}>{category.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
