import React from "react";
import styles from "./About.module.css";
import { FaYoutube, FaFacebook, FaInstagram } from "react-icons/fa";
import ModelVideo from "../assets/Model_Video.mp4";

const AboutContact = () => {
  return (
    <section className={styles.aboutContactSection} id="about">
      
      {/* About text */}
      <div className={styles.aboutColumn}>
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
      </div>

      {/* Video in middle */}
      <div className={styles.videoColumn}>
        <video src={ModelVideo} autoPlay loop muted playsInline aria-hidden="true" className={styles.modelVideo}></video>
      </div>

      {/* Socials on right */}
      <div className={styles.contactColumn}>
        <h2 className={styles.contactHeading}>Find us</h2>
        <p className={styles.aboutParagraph}>
          Questions about an order or a piece?{" "}
          <a href="mailto:orders@jewelestore.co.za" className={styles.mail}>orders@jewelestore.co.za</a>
        </p>
        <div className={styles.socialLinks}>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="Jewel Store on YouTube"><FaYoutube /></a>
          <a href="https://facebook.com/owkShaun.makgopa" target="_blank" rel="noreferrer" aria-label="Jewel Store on Facebook"><FaFacebook /></a>
          <a href="https://instagram.com/shaun.forty7" target="_blank" rel="noreferrer" aria-label="Jewel Store on Instagram"><FaInstagram /></a>
        </div>
      </div>
    </section>
  );
};

export default AboutContact;
