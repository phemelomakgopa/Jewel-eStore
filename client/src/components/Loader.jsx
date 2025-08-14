import React, { useEffect, useState } from 'react';
import styles from './Loader.module.css';
import logo from '../assets/logo.png'; 

const Loader = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1500); // Show loader for 1.5s
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.loaderWrapper} ${fadeOut ? styles.fadeOut : ''}`}>
      <img src={logo} alt="Jewel Store Logo" className={styles.loaderLogo} />
    </div>
  );
};

export default Loader;
