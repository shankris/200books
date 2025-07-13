import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} 200Books. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
