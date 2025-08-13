import React from 'react';
import styles from './Categories.module.css';

import newJewelImg from '../assets/Bronze_Ring.jpg';
import ringsImg from '../assets/Gold_and_Diamonds_Ring.jpg';
import necklacesImg from '../assets/Gold_Necklaces.jpg';
import braceletsImg from '../assets/Pearly_Bracelet.jpg';
import earringsImg from '../assets/GoldFloral_Earrings.jpg';
import ankletsImg from '../assets/IMG-20250813-WA0017.jpg';

const categories = [
  { name: 'New Jewels', image: newJewelImg },
  { name: 'Rings', image: ringsImg },
  { name: 'Necklaces', image: necklacesImg },
  { name: 'Bracelets', image: braceletsImg },
  { name: 'Earrings', image: earringsImg },
  { name: 'Anklets', image: ankletsImg },
];

const Categories = () => {
  return (
    <section className={styles.categoriesSection}>
      
      {/* Divider Line with Text */}
      <div className={styles.sectionDivider}>
        <span className={styles.categoriesHeading}>CATEGORIES</span>
      </div>

      {/* Categories List */}
      <div className={styles.categoryList}>
        {categories.map((category, index) => (
          <div key={index} className={styles.categoryItem}>
            <img 
              src={category.image} 
              alt={category.name} 
              className={styles.categoryImage} 
            />
            <p className={styles.categoryText}>{category.name}</p>
          </div>
        ))}
      </div>

    </section>
  );
};

export default Categories;
