"use client";

import React from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <nav className={styles.navLinks}>
        <ul className={styles.sidebarLinks}>
          <li>
            <Link href='/books'>Home</Link>
          </li>
          <li>
            <Link href='/upload'>Recommend Books</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
