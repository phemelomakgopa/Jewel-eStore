import React from 'react';
import styles from './About.module.css'; // Assuming you have a CSS file for styling

const About = () => {
  return (
    <section className={styles.aboutSection}>
      <h2 className={styles.aboutHeading}>About</h2>
      <p className={styles.aboutParagraph}>
        Jewel Store is your premier destination for exquisite jewelry. We offer a curated
        collection of timeless designs and modern pieces, crafted with the highest
        standards of quality and passion. Our mission is to help you find the perfect
        piece that celebrates your unique style and precious moments.
      </p>
      <p className={styles.aboutParagraph}>
        Explore our selection of rings, necklaces, earrings, and bracelets, each
        designed to add a touch of elegance and sparkle to your life.
      </p>
    </section>
  );
};

export default About;