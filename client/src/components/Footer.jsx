import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerText}>&copy; {new Date().getFullYear()} Jewel Store. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;