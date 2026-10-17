import React from "react";
import styles from "./Loader.module.css";
import logo from "../assets/logo.png";

// Shown only while Firebase restores the signed-in session.
const Loader = () => (
  <div className={styles.loaderWrapper} role="status" aria-label="Loading Jewel Store">
    <img src={logo} alt="" className={styles.loaderLogo} />
  </div>
);

export default Loader;
