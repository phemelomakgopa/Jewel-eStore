import React from 'react';
import './Categories.css';

const categories = [
  'New Jewels',
  'Rings',
  'Necklaces',
  'Earrings',
  'Bracelets',
];

const Categories = () => {
  return (
    <section className="categories-section">
      <h2>Categories</h2>
      <div className="category-list">
        {categories.map((category, index) => (
          <div key={index} className="category-item">
            {category}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;