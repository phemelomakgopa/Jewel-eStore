import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerText}>&copy; {new Date().getFullYear()} Jewel Store. All visual content has been compiled from publicly available online sources.. </p>
    </footer>
  );
};

export default Footer;