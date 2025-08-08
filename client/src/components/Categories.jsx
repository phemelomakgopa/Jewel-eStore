import React from 'react';
import styles from './Categories.module.css';

const categories = [
  'New Jewels',
  'Rings',
  'Necklaces',
  'Earrings',
  'Bracelets',
];

const Categories = () => {
  return (
    <section className={styles.categoriesSection}>
      <h2 className={styles.categoriesHeading}>Categories</h2>
      <div className={styles.categoryList}>
        {categories.map((category, index) => (
          <div key={index} className={styles.categoryItem}>
            {category}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;